local lu = require('luaunit')
local File = require('lib.file')
local Day18 = require('day18.day18')

TestDay18 = {}

function TestDay18:setUp()
    self.input_test = File:lines_from('day18/input-test.txt')
    self.input = File:lines_from('day18/input.txt')
end

function TestDay18:test_find_reduced_mangitude()
    lu.assertEquals(Day18.find_reduced_mangitude(self.input_test), 4140)
    lu.assertEquals(Day18.find_reduced_mangitude(self.input), 4469)
end

function TestDay18:test_find_largest_magnitude()
    lu.assertEquals(Day18.find_largest_magnitude(self.input_test), 3993)
    lu.assertEquals(Day18.find_largest_magnitude(self.input), 4770)
end
