-- PDF Viewer:
-- http://manpages.ubuntu.com/manpages/trusty/man5/zathurarc.5.html
vim.g["vimtex_view_method"] = "zathura"
vim.g["vimtex_context_pdf_viewer"] = "zathura"
vim.g["vimtex_quickfix_mode"] = 1

-- A few examples of disabling default VimTeX features.
vim.g["vimtex_indent_enabled"] = 1 -- turn off VimTeX indentation
vim.g["vimtex_imaps_enabled"] = 0 -- disable insert mode mappings (e.g. if you use UltiSnips)
vim.g["vimtex_complete_enabled"] = 0 -- turn off completion
vim.g["vimtex_syntax_enabled"] = 1 -- disable syntax conceal
vim.g["vimtex_quickfix_open_on_warning"] = 0 -- don't open quickfix on warnings

-- Error suppression:
-- https://github.com/lervag/vimtex/blob/master/doc/vimtex.txt

vim.g["vimtex_quickfix_ignore_filters"] = {
  "Underfull",
  "Overfull",
  "specifier changed to",
  "Token not allowed in a PDF string",
  "LateX Warning",
  "I found no",
}

vim.cmd([[
noremap <localleader>w <Cmd>update<CR><Cmd>VimtexCompileSS<CR>
noremap <localleader>v <Cmd>VimtexView<CR>
noremap <localleader>i gg=G<C-o>
noremap <localleader>s <Cmd>set syntax=tex<CR>
]])

vim.cmd([[
function! s:TexFocusVim() abort
  " Replace `TERMINAL` with the name of your terminal application
  " Example: execute "!open -a iTerm"
  " Example: execute "!open -a Alacritty"
  silent execute "!open -a iTerm"
  redraw!
endfunction

augroup vimtex_event_focus
  au!
  au User VimtexEventViewReverse call s:TexFocusVim()
augroup END
]])
