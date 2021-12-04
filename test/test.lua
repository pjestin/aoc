local lu = require("luaunit")

require("test.test-string-utils")
require("test.test-vector")
require("test.test-day01")
require("test.test-day02")
require("test.test-day03")
require("test.test-day04")

os.exit(lu.LuaUnit.new():runSuite())
