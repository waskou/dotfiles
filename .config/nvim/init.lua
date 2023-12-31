require("josean.plugins-setup")
require("josean.core.options")
require("josean.core.keymaps")
require("josean.core.colorscheme")
require("josean.plugins.comment")
-- require("josean.plugins.nvim-tree")
require("josean.plugins.lualine")
require("josean.plugins.telescope")
require("josean.plugins.nvim-cmp")
require("josean.plugins.lsp.mason")
require("josean.plugins.lsp.lspsaga")
require("josean.plugins.lsp.lspconfig")
require("josean.plugins.lsp.null-ls")
require("josean.plugins.autopairs")
require("josean.plugins.treesitter")
require("josean.plugins.gitsigns")
require("josean.plugins.vimtex")
require("josean.plugins.luasnip")
require("josean.plugins.sneak")
-- require("josean.plugins.neorg")
require("josean.plugins.surround")

vim.cmd([[
autocmd BufRead,BufNewFile * setlocal spell spelllang=en_gb
" autocmd BufRead,BufNewFile *.tex set syntax=tex
let g:python3_host_prog = '/opt/homebrew/bin/python3'
let g:pickachu_default_date_format = "\\mydate{%d}{%m}{%Y}"
iab <expr> ddate strftime("%c")
iab <expr> ttime strftime("%H:%M")
iab <expr> ptime strftime("%l:%M %p")
]])
