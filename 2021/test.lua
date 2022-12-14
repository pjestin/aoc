local lu = require("luaunit")

require("lib.test-priority-queue")
require("lib.test-stack")
require("lib.test-string-utils")
require("lib.test-table-utils")
require("lib.test-queue")
require("lib.test-vector")
require("day01.test-day01")
require("day02.test-day02")
require("day03.test-day03")
require("day04.test-day04")
require("day05.test-day05")
require("day06.test-day06")
require("day07.test-day07")
require("day08.test-day08")
require("day09.test-day09")
require("day10.test-day10")
require("day11.test-day11")
require("day12.test-day12")
require("day13.test-day13")
require("day14.test-day14")
require("day15.test-day15")
require("day16.test-day16")
require("day17.test-day17")
require("day18.test-day18")
require("day19.test-day19")
require("day20.test-day20")
require("day21.test-day21")
require("day22.test-day22")
require("day23.test-day23")
require("day24.test-day24")
require("day25.test-day25")

os.exit(lu.LuaUnit.new():runSuite())
