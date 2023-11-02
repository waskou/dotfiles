vim.cmd([[
" Expand or jump in insert mode
imap <silent><expr> <Bar> luasnip#expand_or_jumpable() ? '<Plug>luasnip-expand-or-jump' : '<Bar>' 

" Jump forward through tabstops in visual mode
smap <silent><expr> <Bar> luasnip#jumpable(1) ? '<Plug>luasnip-jump-next' : '<Bar>'

" Jump backward through snippet tabstops with Shift-Tab (for example)
imap <silent><expr> <C-Bar> luasnip#jumpable(-1) ? '<Plug>luasnip-jump-prev' : '<C-Bar>'
smap <silent><expr> <C-Bar> luasnip#jumpable(-1) ? '<Plug>luasnip-jump-prev' : '<C-Bar>'
]])

require("luasnip.loaders.from_lua").load({ paths = "~/.config/nvim/LuaSnip/" })

require("luasnip").config.set_config({ -- Setting LuaSnip config

  -- Enable autotriggered snippets
  enable_autosnippets = true,

  -- Use Tab (or some other key if you prefer) to trigger visual selection
  store_selection_keys = ";",

  -- Update snippets in real time as you type
  update_events = "TextChanged,TextChangedI",
})
