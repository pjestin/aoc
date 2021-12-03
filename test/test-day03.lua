local lu = require('luaunit')
local File = require('lib.file')
local Day03 = require('day03.day03')

TestDay03 = {}

function TestDay03:setUp()
    self.input_test = File:lines_from('day03/input-test.txt')
    self.input = File:lines_from('day03/input.txt')
end

function TestDay03:test_power_consumption()
    lu.assertEquals(Day03:power_consumption(self.input_test), 198)
    lu.assertEquals(Day03:power_consumption(self.input), 2035764)
end

return TestDay03
