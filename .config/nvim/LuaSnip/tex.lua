-- Abbreviations used in this article and the LuaSnip docs
local ls = require("luasnip")
local s = ls.snippet
local sn = ls.snippet_node
local t = ls.text_node
local i = ls.insert_node
local f = ls.function_node
local d = ls.dynamic_node
local fmt = require("luasnip.extras.fmt").fmt
local fmta = require("luasnip.extras.fmt").fmta
local rep = require("luasnip.extras").rep

-- mathzone detection
-----------------------
-----------------------
-- This Lua module provides utility functions using nvim-treesitter to check the
-- node position in the AST.

local has_treesitter, ts = pcall(require, "vim.treesitter")
local _, query = pcall(require, "vim.treesitter.query")

local MATH_ENVIRONMENTS = {
  displaymath = true,
  equation = true,
  eqnarray = true,
  align = true,
  math = true,
  array = true,
}
local MATH_NODES = {
  displayed_equation = true,
  inline_formula = true,
}

local get_node_at_cursor = function()
  local cursor = vim.api.nvim_win_get_cursor(0)
  local cursor_range = { cursor[1] - 1, cursor[2] }
  local buf = vim.api.nvim_get_current_buf()
  local ok, parser = pcall(ts.get_parser, buf, "latex")
  if not ok or not parser then
    return
  end
  local root_tree = parser:parse()[1]
  local root = root_tree and root_tree:root()

  if not root then
    return
  end

  return root:named_descendant_for_range(cursor_range[1], cursor_range[2], cursor_range[1], cursor_range[2])
end

local in_comment = function()
  if has_treesitter then
    local node = get_node_at_cursor()
    while node do
      if node:type() == "comment" then
        return true
      end
      node = node:parent()
    end
    return false
  end
end

-- https://github.com/nvim-treesitter/nvim-treesitter/issues/1184#issuecomment-830388856
local in_mathzone = function()
  if has_treesitter then
    local buf = vim.api.nvim_get_current_buf()
    local node = get_node_at_cursor()
    while node do
      if MATH_NODES[node:type()] then
        return true
      elseif node:type() == "math_environment" or node:type() == "generic_environment" then
        local begin = node:child(0)
        local names = begin and begin:field("name")
        if names and names[1] and MATH_ENVIRONMENTS[ts.get_node_text(names[1], buf):match("[A-Za-z]+")] then
          return true
        end
      end
      node = node:parent()
    end
    return false
  end
end

-----------------------
-----------------------

-- functions from ejmastnak
---------------------------
---------------------------
local get_visual = function(args, parent)
  if #parent.snippet.env.LS_SELECT_RAW > 0 then
    return sn(nil, t(parent.snippet.env.LS_SELECT_RAW))
  else -- If LS_SELECT_RAW is empty, return a blank insert node
    return sn(nil, i(1))
  end
end

-- local in_mathzone = function()
--   -- The `in_mathzone` function requires the VimTeX plugin
--   return vim.fn["vimtex#syntax#in_mathzone"]() == 1
-- end

local line_begin = require("luasnip.extras.expand_conditions").line_begin
---------------------------
---------------------------

-- my string split functions
function table.contains(table, element)
  for _, value in pairs(table) do
    if value == element then
      return true
    end
  end
  return false
end

local openers = { "(", "{", "[" }
local closers = { ")", "}", "]" }

local DetermineExcessiveBrackets = function(input)
  local level = 0
  for iter = 1, #input do
    local c = input:sub(iter, iter)
    if table.contains(openers, c) then
      level = level + 1
    elseif table.contains(closers, c) then
      level = level - 1
    end
  end
  return level
end

local FindLastSpacePos = function(str)
  local open = 0 -- to count opening brackets
  local last_space = nil -- to store the position of the last non-enclosed space

  -- iterate string in reverse order
  for iter = string.len(str), 1, -1 do
    local c = string.sub(str, iter, iter) -- get the current character

    if table.contains(openers, c) then -- found an opening bracket
      open = open + 1
    elseif table.contains(closers, c) then -- found a closing bracket, decrease the counter
      open = open - 1
    end

    -- if the current character is a space and we are not inside brackets
    if c == " " and open == 0 then
      last_space = iter
      break -- stop because we found the last space not inside brackets
    end
  end

  return last_space
end

local FindLastUnbalancedBracketPos = function(str)
  local count = 0 -- count of brackets
  local last_unbalanced_pos = nil -- position of last unbalanced opening bracket

  -- iterate string in reverse order
  for iter = string.len(str), 1, -1 do
    local c = string.sub(str, iter, iter) -- get current character

    if table.contains(closers, c) then -- if we find a closing bracket
      count = count + 1
    elseif table.contains(openers, c) then -- if we find an opening bracket
      if count > 0 then
        count = count - 1
      else
        last_unbalanced_pos = iter
        break -- Stop at the last unbalanced "[".
      end
    end
  end
  return last_unbalanced_pos
end

local StringSplit = function(input)
  local result = {}
  if DetermineExcessiveBrackets(input) == 0 then
    if FindLastSpacePos(input) == nil then
      result[1] = ""
      result[2] = input
      return result
    else
      result[1] = string.sub(input, 1, FindLastSpacePos(input))
      result[2] = string.sub(input, FindLastSpacePos(input) + 1, #input)
      return result
    end
  elseif DetermineExcessiveBrackets(input) == 1 then
    if FindLastSpacePos(input) == nil then
      result[1] = string.sub(input, 1, FindLastUnbalancedBracketPos(input))
      result[2] = string.sub(input, FindLastUnbalancedBracketPos(input) + 1, #input)
      return result
    elseif FindLastSpacePos(input) > FindLastUnbalancedBracketPos(input) then
      result[1] = string.sub(input, 1, FindLastSpacePos(input))
      result[2] = string.sub(input, FindLastSpacePos(input) + 1, #input)
      return result
    elseif FindLastSpacePos(input) < FindLastUnbalancedBracketPos(input) then
      result[1] = string.sub(input, 1, FindLastUnbalancedBracketPos(input))
      result[2] = string.sub(input, FindLastUnbalancedBracketPos(input) + 1, #input)
      return result
    end
  else
    result[1] = ""
    result[2] = input
    return result
  end
end

local trigger_opener = ";"

local fsc = function(int)
  return f(function(_, snip)
    return StringSplit(snip.captures[1])[int]
  end)
end

local fc = function(int)
  return f(function(_, snip)
    return snip.captures[int]
  end)
end

local dg = function(int)
  return d(int, get_visual)
end

local Asnip = function(trigger, table)
  return s(
    { trig = "(.*)" .. trigger_opener .. trigger, regTrig = true, wordTrig = false, snippetType = "autosnippet" },
    table
  )
end

local Osnip = function(trigger, table)
  return s({
    trig = "([%s%(%[%{%$])" .. trigger_opener .. trigger,
    regTrig = true,
    wordTrig = false,
    priority = 2000,
    snippetType = "autosnippet",
  }, table)
end

local Ssnip = function(trigger, table)
  return s({ trig = trigger, wordTrig = false }, table)
end

local tk = {
  -- one argument snippets
  ["inline_math"] = "w",
  ["sqrt"] = "sr",
  ["abs"] = "ab",
  ["norm"] = "nm",
  ["order"] = "bo",
  ["qty1"] = "qa",
  ["qty2"] = "qb",
  ["qty3"] = "qc",
  ["widehat"] = "oh",
  ["widetilde"] = "ot",
  ["overline"] = "ol",
  ["exp"] = "fe",
  ["log"] = "fl",
  ["det"] = "fd",
  ["Trace"] = "fT",
  ["Res"] = "fR",
  ["Re"] = "fr",
  ["Im"] = "fi",
  ["text"] = "tn",
  ["textit"] = "ti",
  ["textbf"] = "tb",
  ["texttt"] = "tt",
  ["mathcal"] = "mc",
  ["mathfrak"] = "mf",
  ["mathbb"] = "mb",
  ["vb"] = "mv",
  ["path_integral_measure"] = "DD",
  ["group_O"] = "go",
  ["group_U"] = "gu",
  ["group_Sp"] = "gsp",
  ["group_SO"] = "gso",
  ["group_SU"] = "gsu",
  ["algebra_o"] = "ao",
  ["algebra_u"] = "au",
  ["algebra_sp"] = "asp",
  ["algebra_so"] = "aso",
  ["algebra_su"] = "asu",
  -- one argument parameter snippets
  ["dd"] = "dd",
  ["sin"] = "fs",
  ["cos"] = "fc",
  ["tan"] = "ft",
  ["asin"] = "fas",
  ["acos"] = "fac",
  ["atan"] = "fat",
  ["sinh"] = "fhs",
  ["cosh"] = "fhc",
  ["tanh"] = "fht",
  -- two argument snippets
  ["frac"] = "ff",
  ["comm"] = "cb",
  ["acomm"] = "cc",
  ["overset"] = "su",
  ["underset"] = "sv",
  ["overbrace"] = "bu",
  ["underbrace"] = "bv",
  -- two argument parameter snippets
  ["dv"] = "dv",
  ["pdv"] = "dp",
  ["fdv"] = "df",
  -- three argument snippets
  ["eval"] = "at",
  ["sum"] = "ps",
  ["prod"] = "pp",
  ["int"] = "pi",
}

return {
  -- one argument snippets
  Asnip(tk.inline_math, { fsc(1), t("$"), fsc(2), t("$ ") }),
  Osnip(tk.inline_math, { fc(1), t("$"), i(1), t("$ ") }),
  Ssnip(tk.inline_math, { t("$"), dg(1), t("$ ") }),
  --
  Asnip(tk.sqrt, { fsc(1), t("\\sqrt{"), fsc(2), t("}") }),
  Osnip(tk.sqrt, { fc(1), t("\\sqrt{"), i(1), t("}") }),
  Ssnip(tk.sqrt, { t("\\sqrt{"), dg(1), t("}") }),
  --
  Asnip(tk.abs, { fsc(1), t("\\abs{"), fsc(2), t("}") }),
  Osnip(tk.abs, { fc(1), t("\\abs{"), i(1), t("}") }),
  Ssnip(tk.abs, { t("\\abs{"), dg(1), t("}") }),
  --
  Asnip(tk.norm, { fsc(1), t("\\norm{"), fsc(2), t("}") }),
  Osnip(tk.norm, { fc(1), t("\\norm{"), i(1), t("}") }),
  Ssnip(tk.norm, { t("\\norm{"), dg(1), t("}") }),
  --
  Asnip(tk.order, { fsc(1), t("\\order{"), fsc(2), t("}") }),
  Osnip(tk.order, { fc(1), t("\\order{"), i(1), t("}") }),
  Ssnip(tk.order, { t("\\order{"), dg(1), t("}") }),
  --
  Asnip(tk.qty1, { fsc(1), t("\\qty("), fsc(2), t(")") }),
  Osnip(tk.qty1, { fc(1), t("\\qty("), i(1), t(")") }),
  Ssnip(tk.qty1, { t("\\qty("), dg(1), t(")") }),
  --
  Asnip(tk.qty2, { fsc(1), t("\\qty["), fsc(2), t("]") }),
  Osnip(tk.qty2, { fc(1), t("\\qty["), i(1), t("]") }),
  Ssnip(tk.qty2, { t("\\qty["), dg(1), t("]") }),
  --
  Asnip(tk.qty3, { fsc(1), t("\\qty{"), fsc(2), t("}") }),
  Osnip(tk.qty3, { fc(1), t("\\qty{"), i(1), t("}") }),
  Ssnip(tk.qty3, { t("\\qty{"), dg(1), t("}") }),
  --
  Asnip(tk.widehat, { fsc(1), t("\\widehat{"), fsc(2), t("}") }),
  Osnip(tk.widehat, { fc(1), t("\\widehat{"), i(1), t("}") }),
  Ssnip(tk.widehat, { t("\\widehat{"), dg(1), t("}") }),
  --
  Asnip(tk.widetilde, { fsc(1), t("\\widetilde{"), fsc(2), t("}") }),
  Osnip(tk.widetilde, { fc(1), t("\\widetilde{"), i(1), t("}") }),
  Ssnip(tk.widetilde, { t("\\widetilde{"), dg(1), t("}") }),
  --
  Asnip(tk.overline, { fsc(1), t("\\overline{"), fsc(2), t("}") }),
  Osnip(tk.overline, { fc(1), t("\\overline{"), i(1), t("}") }),
  Ssnip(tk.overline, { t("\\overline{"), dg(1), t("}") }),
  --
  Asnip(tk.exp, { fsc(1), t("\\exp{"), fsc(2), t("}") }),
  Osnip(tk.exp, { fc(1), t("\\exp{"), i(1), t("}") }),
  Ssnip(tk.exp, { t("\\exp{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.log, { fsc(1), t("\\log{"), fsc(2), t("}") }),
  Osnip(tk.log, { fc(1), t("\\log{"), i(1), t("}") }),
  Ssnip(tk.log, { t("\\log{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.det, { fsc(1), t("\\det{"), fsc(2), t("}") }),
  Osnip(tk.det, { fc(1), t("\\det{"), i(1), t("}") }),
  Ssnip(tk.det, { t("\\det{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.Trace, { fsc(1), t("\\Trace{"), fsc(2), t("}") }),
  Osnip(tk.Trace, { fc(1), t("\\Trace{"), i(1), t("}") }),
  Ssnip(tk.Trace, { t("\\Trace{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.Res, { fsc(1), t("\\Res{"), fsc(2), t("}") }),
  Osnip(tk.Res, { fc(1), t("\\Res{"), i(1), t("}") }),
  Ssnip(tk.Res, { t("\\Res{\\qty["), dg(1), t("]}") }),
  --
  Asnip(tk.Re, { fsc(1), t("\\Re{"), fsc(2), t("}") }),
  Osnip(tk.Re, { fc(1), t("\\Re{"), i(1), t("}") }),
  Ssnip(tk.Re, { t("\\Re{\\qty["), dg(1), t("]}") }),
  --
  Asnip(tk.Im, { fsc(1), t("\\Im{"), fsc(2), t("}") }),
  Osnip(tk.Im, { fc(1), t("\\Im{"), i(1), t("}") }),
  Ssnip(tk.Im, { t("\\Im{\\qty["), dg(1), t("]}") }),
  --
  Asnip(tk.textit, { fsc(1), t("\\textit{"), fsc(2), t("}") }),
  Osnip(tk.textit, { fc(1), t("\\textit{"), i(1), t("}") }),
  Ssnip(tk.textit, { t("\\textit{"), dg(1), t("}") }),
  --
  Asnip(tk.text, { fsc(1), t("\\text{"), fsc(2), t("}") }),
  Osnip(tk.text, { fc(1), t("\\text{"), i(1), t("}") }),
  Ssnip(tk.text, { t("\\text{"), dg(1), t("}") }),
  --
  Asnip(tk.textbf, { fsc(1), t("\\textbf{"), fsc(2), t("}") }),
  Osnip(tk.textbf, { fc(1), t("\\textbf{"), i(1), t("}") }),
  Ssnip(tk.textbf, { t("\\textbf{"), dg(1), t("}") }),
  --
  Asnip(tk.texttt, { fsc(1), t("\\texttt{"), fsc(2), t("}") }),
  Osnip(tk.texttt, { fc(1), t("\\texttt{"), i(1), t("}") }),
  Ssnip(tk.texttt, { t("\\texttt{"), dg(1), t("}") }),
  --
  Asnip(tk.mathcal, { fsc(1), t("\\mathcal{"), fsc(2), t("}") }),
  Osnip(tk.mathcal, { fc(1), t("\\mathcal{"), i(1), t("}") }),
  Ssnip(tk.mathcal, { t("\\mathcal{"), dg(1), t("}") }),
  --
  Asnip(tk.mathfrak, { fsc(1), t("\\mathfrak{"), fsc(2), t("}") }),
  Osnip(tk.mathfrak, { fc(1), t("\\mathfrak{"), i(1), t("}") }),
  Ssnip(tk.mathfrak, { t("\\mathfrak{"), dg(1), t("}") }),
  --
  Asnip(tk.mathbb, { fsc(1), t("\\mathbb{"), fsc(2), t("}") }),
  Osnip(tk.mathbb, { fc(1), t("\\mathbb{"), i(1), t("}") }),
  Ssnip(tk.mathbb, { t("\\mathbb{"), dg(1), t("}") }),
  --
  Asnip(tk.vb, { fsc(1), t("\\vb{"), fsc(2), t("}") }),
  Osnip(tk.vb, { fc(1), t("\\vb{"), i(1), t("}") }),
  Ssnip(tk.vb, { t("\\vb{"), dg(1), t("}") }),
  --
  Asnip(tk.path_integral_measure, { fsc(1), t("\\mathcal{D}{"), fsc(2), t("} \\,") }),
  Osnip(tk.path_integral_measure, { fc(1), t("\\mathcal{D}{"), i(1), t("} \\,") }),
  Ssnip(tk.path_integral_measure, { t("\\mathcal{D}{"), dg(1), t("} \\,") }),
  --
  Asnip(tk.group_O, { fsc(1), t("\\text{O}\\qty("), fsc(2), t(")") }),
  Osnip(tk.group_O, { fc(1), t("\\text{O}\\qty("), i(1), t(")") }),
  Ssnip(tk.group_O, { t("\\text{O}\\qty("), dg(1), t(")") }),
  --
  Asnip(tk.group_U, { fsc(1), t("\\text{U}\\qty("), fsc(2), t(")") }),
  Osnip(tk.group_U, { fc(1), t("\\text{U}\\qty("), i(1), t(")") }),
  Ssnip(tk.group_U, { t("\\text{U}\\qty("), dg(1), t(")") }),
  --
  Asnip(tk.group_Sp, { fsc(1), t("\\text{Sp}\\qty("), fsc(2), t(")") }),
  Osnip(tk.group_Sp, { fc(1), t("\\text{Sp}\\qty("), i(1), t(")") }),
  Ssnip(tk.group_Sp, { t("\\text{Sp}\\qty("), dg(1), t(")") }),
  --
  Asnip(tk.group_SO, { fsc(1), t("\\text{SO}\\qty("), fsc(2), t(")") }),
  Osnip(tk.group_SO, { fc(1), t("\\text{SO}\\qty("), i(1), t(")") }),
  Ssnip(tk.group_SO, { t("\\text{SO}\\qty("), dg(1), t(")") }),
  --
  Asnip(tk.group_SU, { fsc(1), t("\\text{SU}\\qty("), fsc(2), t(")") }),
  Osnip(tk.group_SU, { fc(1), t("\\text{SU}\\qty("), i(1), t(")") }),
  Ssnip(tk.group_SU, { t("\\text{SU}\\qty("), dg(1), t(")") }),
  --
  Asnip(tk.algebra_o, { fsc(1), t("\\mathfrak{o}\\qty("), fsc(2), t(")") }),
  Osnip(tk.algebra_o, { fc(1), t("\\mathfrak{o}\\qty("), i(1), t(")") }),
  Ssnip(tk.algebra_o, { t("\\mathfrak{o}\\qty("), dg(1), t(")") }),
  --
  Asnip(tk.algebra_u, { fsc(1), t("\\mathfrak{u}\\qty("), fsc(2), t(")") }),
  Osnip(tk.algebra_u, { fc(1), t("\\mathfrak{u}\\qty("), i(1), t(")") }),
  Ssnip(tk.algebra_u, { t("\\mathfrak{u}\\qty("), dg(1), t(")") }),
  --
  Asnip(tk.algebra_sp, { fsc(1), t("\\mathfrak{sp}\\qty("), fsc(2), t(")") }),
  Osnip(tk.algebra_sp, { fc(1), t("\\mathfrak{sp}\\qty("), i(1), t(")") }),
  Ssnip(tk.algebra_sp, { t("\\mathfrak{sp}\\qty("), dg(1), t(")") }),
  --
  Asnip(tk.algebra_so, { fsc(1), t("\\mathfrak{so}\\qty("), fsc(2), t(")") }),
  Osnip(tk.algebra_so, { fc(1), t("\\mathfrak{so}\\qty("), i(1), t(")") }),
  Ssnip(tk.algebra_so, { t("\\mathfrak{so}\\qty("), dg(1), t(")") }),
  --
  Asnip(tk.algebra_su, { fsc(1), t("\\mathfrac{su}\\qty("), fsc(2), t(")") }),
  Osnip(tk.algebra_su, { fc(1), t("\\mathfrac{su}\\qty("), i(1), t(")") }),
  Ssnip(tk.algebra_su, { t("\\mathfrac{su}\\qty("), dg(1), t(")") }),
  -- one argument parameter snippets
  Asnip(tk.dd, { fsc(1), t("\\dd["), i(1), t("]{"), fsc(2), t("}") }),
  Osnip(tk.dd, { fc(1), t("\\dd["), i(2), t("]{"), i(1), t("}") }),
  Ssnip(tk.dd, { t("\\dd["), i(2), t("]{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.sin, { fsc(1), t("\\sin^{"), i(1), t("}{"), fsc(2), t("}") }),
  Osnip(tk.sin, { fc(1), t("\\sin^{"), i(2), t("}{"), i(1), t("}") }),
  Ssnip(tk.sin, { t("\\sin^{"), i(2), t("}{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.cos, { fsc(1), t("\\cos^{"), i(1), t("}{"), fsc(2), t("}") }),
  Osnip(tk.cos, { fc(1), t("\\cos^{"), i(2), t("}{"), i(1), t("}") }),
  Ssnip(tk.cos, { t("\\cos^{"), i(2), t("}{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.tan, { fsc(1), t("\\tan^{"), i(1), t("}{"), fsc(2), t("}") }),
  Osnip(tk.tan, { fc(1), t("\\tan^{"), i(2), t("}{"), i(1), t("}") }),
  Ssnip(tk.tan, { t("\\tan^{"), i(2), t("}{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.asin, { fsc(1), t("\\asin^{"), i(1), t("}{"), fsc(2), t("}") }),
  Osnip(tk.asin, { fc(1), t("\\asin^{"), i(2), t("}{"), i(1), t("}") }),
  Ssnip(tk.asin, { t("\\asin^{"), i(2), t("}{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.acos, { fsc(1), t("\\acos^{"), i(1), t("}{"), fsc(2), t("}") }),
  Osnip(tk.acos, { fc(1), t("\\acos^{"), i(2), t("}{"), i(1), t("}") }),
  Ssnip(tk.acos, { t("\\acos^{"), i(2), t("}{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.atan, { fsc(1), t("\\atan^{"), i(1), t("}{"), fsc(2), t("}") }),
  Osnip(tk.atan, { fc(1), t("\\atan^{"), i(2), t("}{"), i(1), t("}") }),
  Ssnip(tk.atan, { t("\\atan^{"), i(2), t("}{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.sinh, { fsc(1), t("\\sinh^{"), i(1), t("}{"), fsc(2), t("}") }),
  Osnip(tk.sinh, { fc(1), t("\\sinh^{"), i(2), t("}{"), i(1), t("}") }),
  Ssnip(tk.sinh, { t("\\sinh^{"), i(2), t("}{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.cosh, { fsc(1), t("\\cosh^{"), i(1), t("}{"), fsc(2), t("}") }),
  Osnip(tk.cosh, { fc(1), t("\\cosh^{"), i(2), t("}{"), i(1), t("}") }),
  Ssnip(tk.cosh, { t("\\cosh^{"), i(2), t("}{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.tanh, { fsc(1), t("\\tanh^{"), i(1), t("}{"), fsc(2), t("}") }),
  Osnip(tk.tanh, { fc(1), t("\\tanh^{"), i(2), t("}{"), i(1), t("}") }),
  Ssnip(tk.tanh, { t("\\tanh^{"), i(2), t("}{\\qty("), dg(1), t(")}") }),
  -- two argument snippets
  Asnip(tk.frac, { fsc(1), t("\\frac{"), fsc(2), t("}{"), i(1), t("}") }),
  Osnip(tk.frac, { fc(1), t("\\frac{"), i(1), t("}{"), i(2), t("}") }),
  Ssnip(tk.frac, { t("\\frac{"), dg(1), t("}{"), i(2), t("}") }),
  --
  Asnip(tk.comm, { fsc(1), t("\\comm{"), fsc(2), t("}{"), i(1), t("}") }),
  Osnip(tk.comm, { fc(1), t("\\comm{"), i(1), t("}{"), i(2), t("}") }),
  Ssnip(tk.comm, { t("\\comm{"), dg(1), t("}{"), i(2), t("}") }),
  --
  Asnip(tk.acomm, { fsc(1), t("\\acomm{"), fsc(2), t("}{"), i(1), t("}") }),
  Osnip(tk.acomm, { fc(1), t("\\acomm{"), i(1), t("}{"), i(2), t("}") }),
  Ssnip(tk.acomm, { t("\\acomm{"), dg(1), t("}{"), i(2), t("}") }),
  --
  Asnip(tk.overset, { fsc(1), t("\\overset{"), i(1), t("}{"), fsc(2), t("}") }),
  Osnip(tk.overset, { fc(1), t("\\overset{"), i(2), t("}{"), i(1), t("}") }),
  Ssnip(tk.overset, { t("\\overset{"), i(2), t("}{"), dg(1), t("}") }),
  --
  Asnip(tk.underset, { fsc(1), t("\\underset{"), i(1), t("}{"), fsc(2), t("}") }),
  Osnip(tk.underset, { fc(1), t("\\underset{"), i(2), t("}{"), i(1), t("}") }),
  Ssnip(tk.underset, { t("\\underset{"), i(2), t("}{"), dg(1), t("}") }),
  --
  Asnip(tk.overbrace, { fsc(1), t("\\overbrace{"), fsc(2), t("}^{"), i(1), t("}") }),
  Osnip(tk.overbrace, { fc(1), t("\\overbrace{"), i(1), t("}^{"), i(2), t("}") }),
  Ssnip(tk.overbrace, { t("\\overbrace{"), dg(1), t("}^{"), i(2), t("}") }),
  --
  Asnip(tk.underbrace, { fsc(1), t("\\underbrace{"), fsc(2), t("}_{"), i(1), t("}") }),
  Osnip(tk.underbrace, { fc(1), t("\\underbrace{"), i(1), t("}_{"), i(2), t("}") }),
  Ssnip(tk.underbrace, { t("\\underbrace{"), dg(1), t("}_{"), i(2), t("}") }),
  -- two argument parameter snippets
  Asnip(tk.dv, { fsc(1), t("\\dv["), i(2), t("]{"), fsc(2), t("}{"), i(1), t("}") }),
  Osnip(tk.dv, { fc(1), t("\\dv["), i(3), t("]{"), i(1), t("}{"), i(2), t("}") }),
  Ssnip(tk.dv, { t("\\dv["), i(3), t("]{}{"), i(2), t("}\\qty("), dg(1), t(")") }),
  --
  Asnip(tk.pdv, { fsc(1), t("\\pdv["), i(2), t("]{"), fsc(2), t("}{"), i(1), t("}") }),
  Osnip(tk.pdv, { fc(1), t("\\pdv["), i(3), t("]{"), i(1), t("}{"), i(2), t("}") }),
  Ssnip(tk.pdv, { t("\\pdv["), i(3), t("]{}{"), i(2), t("}\\qty("), dg(1), t(")") }),
  --
  Asnip(tk.fdv, { fsc(1), t("\\fdv["), i(2), t("]{"), fsc(2), t("}{"), i(1), t("}") }),
  Osnip(tk.fdv, { fc(1), t("\\fdv["), i(3), t("]{"), i(1), t("}{"), i(2), t("}") }),
  Ssnip(tk.fdv, { t("\\fdv["), i(3), t("]{}{"), i(2), t("}\\qty("), dg(1), t(")") }),
  -- three argument snippets
  Asnip(tk.eval, { fsc(1), t("\\eval{"), fsc(2), t("}_{"), i(1), t("}^{"), i(2), t("}") }),
  Osnip(tk.eval, { fc(1), t("\\eval{"), i(1), t("}_{"), i(2), t("}^{"), i(3), t("}") }),
  Ssnip(tk.eval, { t("\\eval{\\qty("), dg(1), t(")}_{"), i(2), t("}^{"), i(3), t("}") }),
  --
  Asnip(tk.sum, { fsc(1), t("\\sum_{"), i(1), t("}^{"), i(2), t("}{"), fsc(2), t("}") }),
  Osnip(tk.sum, { fc(1), t("\\sum_{"), i(1), t("}^{"), i(2), t("}{"), i(3), t("}") }),
  Ssnip(tk.sum, { t("\\sum_{"), i(2), t("}^{"), i(3), t("}{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.prod, { fsc(1), t("\\prod_{"), i(1), t("}^{"), i(2), t("}{"), fsc(2), t("}") }),
  Osnip(tk.prod, { fc(1), t("\\prod_{"), i(1), t("}^{"), i(2), t("}{"), i(3), t("}") }),
  Ssnip(tk.prod, { t("\\prod_{"), i(2), t("}^{"), i(3), t("}{\\qty("), dg(1), t(")}") }),
  --
  Asnip(tk.int, { fsc(1), t("\\int_{"), i(1), t("}^{"), i(2), t("}{"), fsc(2), t("}") }),
  Osnip(tk.int, { fc(1), t("\\int_{"), i(1), t("}^{"), i(2), t("}{"), i(3), t("}") }),
  Ssnip(tk.int, { t("\\int_{"), i(2), t("}^{"), i(3), t("}{\\qty("), dg(1), t(")}") }),
  -- autospace-ing
  s(
    { trig = "([^ _!:@=><])=", wordTrig = false, regTrig = true, snippetType = "autosnippet" },
    { fc(1), t(" = ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = "([^ _@=+><-])+", wordTrig = false, regTrig = true, snippetType = "autosnippet" },
    { fc(1), t(" + ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = "([^ _=+><-])-", wordTrig = false, regTrig = true, snippetType = "autosnippet" },
    { fc(1), t(" - ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = "([^ _=+><-])>", wordTrig = false, regTrig = true, snippetType = "autosnippet" },
    { fc(1), t(" > ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = "([^ _=+><-])<", wordTrig = false, regTrig = true, snippetType = "autosnippet" },
    { fc(1), t(" < ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = "([^ _=+><-])&", wordTrig = false, regTrig = true, snippetType = "autosnippet" },
    { fc(1), t(" & ") },
    { condition = in_mathzone }
  ),
  --
  s({ trig = "$ .", wordTrig = false, snippetType = "autosnippet", priority = 2000 }, { t("$. ") }),
  s({ trig = "$ -", wordTrig = false, snippetType = "autosnippet", priority = 3000 }, { t("$-") }),
  -- special symbols
  s({ trig = "  ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\, ") }, { condition = in_mathzone }),
  s({ trig = " q ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\quad ") }, { condition = in_mathzone }),
  s({ trig = " Q ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\qquad ") }, { condition = in_mathzone }),
  s({ trig = " , ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\,, ") }, { condition = in_mathzone }),
  s({ trig = " . ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\,. ") }, { condition = in_mathzone }),
  --
  s({ trig = " ~ ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\sim ") }, { condition = in_mathzone }),
  s({ trig = " @= ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\propto ") }, { condition = in_mathzone }),
  s(
    { trig = " -> ", wordTrig = false, snippetType = "autosnippet" },
    { t(" \\rightarrow ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = " <- ", wordTrig = false, snippetType = "autosnippet" },
    { t(" \\leftarrow ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = " <-> ", wordTrig = false, snippetType = "autosnippet" },
    { t(" \\leftrightarrow ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = " --> ", wordTrig = false, snippetType = "autosnippet" },
    { t(" \\longrightarrow ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = " <-- ", wordTrig = false, snippetType = "autosnippet" },
    { t(" \\longleftarrow ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = " <-- ", wordTrig = false, snippetType = "autosnippet" },
    { t(" \\longleftarrow ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = " <--> ", wordTrig = false, snippetType = "autosnippet" },
    { t(" \\longleftrightarrow ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = " => ", wordTrig = false, snippetType = "autosnippet" },
    { t(" \\implies ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = " <= ", wordTrig = false, snippetType = "autosnippet" },
    { t(" \\impliedby ") },
    { condition = in_mathzone }
  ),
  s(
    { trig = " <=> ", wordTrig = false, snippetType = "autosnippet" },
    { t(" \\Longleftrightarrow ") },
    { condition = in_mathzone }
  ),
  s({ trig = " >_ ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\geq ") }, { condition = in_mathzone }),
  s({ trig = " <_ ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\leq ") }, { condition = in_mathzone }),
  s({ trig = " >> ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\gg ") }, { condition = in_mathzone }),
  s({ trig = " << ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\ll ") }, { condition = in_mathzone }),
  s({ trig = " != ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\neq ") }, { condition = in_mathzone }),
  s(
    { trig = " := ", wordTrig = false, snippetType = "autosnippet" },
    { t(" \\coloneqq ") },
    { condition = in_mathzone }
  ),
  s({ trig = " == ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\equiv ") }, { condition = in_mathzone }),
  s({ trig = " .. ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\dots ") }, { condition = in_mathzone }),
  s({ trig = " .u ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\udots ") }, { condition = in_mathzone }),
  s({ trig = " .d ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\ddots ") }, { condition = in_mathzone }),
  s({ trig = " .v ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\vdots ") }),
  s({ trig = " @x ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\otimes ") }),
  s({ trig = " @+ ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\oplus ") }),
  s({ trig = " w ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\wedge ") }),
  s({ trig = " x ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\times ") }),
  s({ trig = " c. ", wordTrig = false, snippetType = "autosnippet" }, { t(" \\cdot ") }),
  -- non-spaced special symbols
  s({ trig = "@@", wordTrig = false, snippetType = "autosnippet" }, { t("\\infty") }, { condition = in_mathzone }),
  s({ trig = "yy", wordTrig = false, snippetType = "autosnippet" }, { t("\\partial") }, { condition = in_mathzone }),
  s({ trig = "RR", wordTrig = false, snippetType = "autosnippet" }, { t("\\mathbb{R}") }, { condition = in_mathzone }),
  s({ trig = "CC", wordTrig = false, snippetType = "autosnippet" }, { t("\\mathbb{C}") }, { condition = in_mathzone }),
  s({ trig = "II", wordTrig = false, snippetType = "autosnippet" }, { t("\\iu") }, { condition = in_mathzone }),
  --
  s({ trig = "ga", wordTrig = false, snippetType = "autosnippet" }, { t("\\alpha") }, { condition = in_mathzone }),
  s({ trig = "gb", wordTrig = false, snippetType = "autosnippet" }, { t("\\beta") }, { condition = in_mathzone }),
  s({ trig = "gg", wordTrig = false, snippetType = "autosnippet" }, { t("\\gamma") }, { condition = in_mathzone }),
  s({ trig = "GG", wordTrig = false, snippetType = "autosnippet" }, { t("\\Gamma") }, { condition = in_mathzone }),
  s({ trig = "gd", wordTrig = false, snippetType = "autosnippet" }, { t("\\delta") }, { condition = in_mathzone }),
  s({ trig = "GD", wordTrig = false, snippetType = "autosnippet" }, { t("\\Delta") }, { condition = in_mathzone }),
  s({ trig = "ge", wordTrig = false, snippetType = "autosnippet" }, { t("\\epsilon") }, { condition = in_mathzone }),
  s(
    { trig = "gve", wordTrig = false, snippetType = "autosnippet" },
    { t("\\varepsilon") },
    { condition = in_mathzone }
  ),
  s({ trig = "gz", wordTrig = false, snippetType = "autosnippet" }, { t("\\zeta") }, { condition = in_mathzone }),
  s({ trig = "gh", wordTrig = false, snippetType = "autosnippet" }, { t("\\eta") }, { condition = in_mathzone }),
  s({ trig = "gq", wordTrig = false, snippetType = "autosnippet" }, { t("\\theta") }, { condition = in_mathzone }),
  s({ trig = "GQ", wordTrig = false, snippetType = "autosnippet" }, { t("\\Theta") }, { condition = in_mathzone }),
  s({ trig = "gk", wordTrig = false, snippetType = "autosnippet" }, { t("\\kappa") }, { condition = in_mathzone }),
  s({ trig = "gl", wordTrig = false, snippetType = "autosnippet" }, { t("\\lambda") }, { condition = in_mathzone }),
  s({ trig = "GL", wordTrig = false, snippetType = "autosnippet" }, { t("\\Lambda") }, { condition = in_mathzone }),
  s({ trig = "gm", wordTrig = false, snippetType = "autosnippet" }, { t("\\mu") }, { condition = in_mathzone }),
  s({ trig = "gn", wordTrig = false, snippetType = "autosnippet" }, { t("\\nu") }, { condition = in_mathzone }),
  s({ trig = "gx", wordTrig = false, snippetType = "autosnippet" }, { t("\\xi") }, { condition = in_mathzone }),
  s({ trig = "gp", wordTrig = false, snippetType = "autosnippet" }, { t("\\pi") }, { condition = in_mathzone }),
  s({ trig = "GP", wordTrig = false, snippetType = "autosnippet" }, { t("\\Pi") }, { condition = in_mathzone }),
  s({ trig = "gr", wordTrig = false, snippetType = "autosnippet" }, { t("\\rho") }, { condition = in_mathzone }),
  s({ trig = "gvr", wordTrig = false, snippetType = "autosnippet" }, { t("\\varrho") }, { condition = in_mathzone }),
  s({ trig = "gs", wordTrig = false, snippetType = "autosnippet" }, { t("\\sigma") }, { condition = in_mathzone }),
  s({ trig = "GS", wordTrig = false, snippetType = "autosnippet" }, { t("\\Sigma") }, { condition = in_mathzone }),
  s({ trig = "gt", wordTrig = false, snippetType = "autosnippet" }, { t("\\tau") }, { condition = in_mathzone }),
  s({ trig = "gf", wordTrig = false, snippetType = "autosnippet" }, { t("\\phi") }, { condition = in_mathzone }),
  s({ trig = "GF", wordTrig = false, snippetType = "autosnippet" }, { t("\\Phi") }, { condition = in_mathzone }),
  s({ trig = "gvf", wordTrig = false, snippetType = "autosnippet" }, { t("\\varphi") }, { condition = in_mathzone }),
  s({ trig = "gc", wordTrig = false, snippetType = "autosnippet" }, { t("\\chi") }, { condition = in_mathzone }),
  s({ trig = "gy", wordTrig = false, snippetType = "autosnippet" }, { t("\\psi") }, { condition = in_mathzone }),
  s({ trig = "GY", wordTrig = false, snippetType = "autosnippet" }, { t("\\Psi") }, { condition = in_mathzone }),
  s({ trig = "go", wordTrig = false, snippetType = "autosnippet" }, { t("\\omega") }, { condition = in_mathzone }),
  s({ trig = "GO", wordTrig = false, snippetType = "autosnippet" }, { t("\\Omega") }, { condition = in_mathzone }),
  -- subscripts and superscripts
  s(
    { trig = ";u", wordTrig = false, snippetType = "autosnippet" },
    { t("^{"), i(1), t("}") },
    { condition = in_mathzone }
  ),
  s(
    { trig = ";v", wordTrig = false, snippetType = "autosnippet" },
    { t("_{"), i(1), t("}") },
    { condition = in_mathzone }
  ),
  s({ trig = "uu", wordTrig = false, snippetType = "autosnippet" }, { t("^") }, { condition = in_mathzone }),
  s({ trig = "vv", wordTrig = false, snippetType = "autosnippet" }, { t("_") }, { condition = in_mathzone }),
  -- templates
  s(
    { trig = "tmp", snippetType = "autosnippet" },
    fmta(
      [[
      \RequirePackage{import}
      \subimport{../}{preamble.tex}

      \begin{document}

      \title{<>}
      \author{Vasil Dimitrov}
      \date{\today}
      \maketitle

      <>

      \newpage
      \bibliographystyle{../JHEP}
      \bibliography{../bib-inspireized}
      \end{document}
     ]],
      { i(1), i(2) }
    ),
    { condition = line_begin }
  ),
  -- environments
  s(
    { trig = "ali", snippetType = "autosnippet" },
    fmta(
      [[
       \begin{align}
         <> <><> <>
       \end{align}
     ]],
      { i(1), i(2, "="), t("{}&"), i(3) }
    ),
    { condition = line_begin }
  ),
  s(
    { trig = "ald", snippetType = "autosnippet" },
    fmta(
      [[
       \begin{align}
         \begin{aligned}
           <> <><> <>
         \end{aligned}
       \end{align}
     ]],
      { i(1), i(2, "="), t("{}&"), i(3) }
    ),
    { condition = line_begin }
  ),
  s(
    { trig = ",nl", wordTrig = false, snippetType = "autosnippet" },
    fmta(
      [[
      \,, \\
      <> <><> <>
     ]],
      { i(1), i(2, "="), t("{}&"), i(3) }
    )
  ),
  s(
    { trig = " nl", wordTrig = false, snippetType = "autosnippet" },
    fmta(
      [[
       \notag \\
      <> <>
     ]],
      { t("&"), i(1) }
    )
  ),
  s(
    { trig = " nnl", wordTrig = false, snippetType = "autosnippet" },
    fmta(
      [[
       \\
      <> <>
     ]],
      { t("&"), i(1) }
    )
  ),
  s(
    { trig = " ald", wordTrig = false, snippetType = "autosnippet" },
    fmta(
      [[


       \begin{aligned}
          <> <><> <>
       \end{aligned}
     ]],
      { i(1), i(2, "="), t("{}&"), i(3) }
    )
  ),
  -- environments helpers
  s({ trig = "= &", wordTrig = false, snippetType = "autosnippet" }, { t("={}& ") }),
  s({ trig = ", &", wordTrig = false, snippetType = "autosnippet" }, { t(", & ") }),
}
