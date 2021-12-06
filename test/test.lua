local lu = require("luaunit")

require("test.test-string-utils")
require("test.test-vector")
require("test.test-day01")
require("test.test-day02")
require("test.test-day03")
require("test.test-day04")
require("test.test-day05")
require("test.test-day06")

os.exit(lu.LuaUnit.new():runSuite())
