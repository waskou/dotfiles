-- import gitsigns plugin safely
local setup, transparent = pcall(require, "transparent")
if not setup then
  return
end

-- configure/enable gitsigns
transparent.setup()
