local lu = require('luaunit')
local File = require('lib.file')
local Day07 = require('day07.day07')

TestDay07 = {}

function TestDay07:setUp()
    self.input_test = File:lines_from('day07/input-test.txt')[1]
    self.input = File:lines_from('day07/input.txt')[1]
end

function TestDay07:test_find_minimum_fuel_simple()
    lu.assertEquals(Day07.find_minimum_fuel_simple(self.input_test), 37)
    lu.assertEquals(Day07.find_minimum_fuel_simple(self.input), 343468)
end

function TestDay07:test_find_minimum_fuel_quadratic()
    lu.assertEquals(Day07.find_minimum_fuel_quadratic(self.input_test), 168)
    lu.assertEquals(Day07.find_minimum_fuel_quadratic(self.input), 96086265)
end
