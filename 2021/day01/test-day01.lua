local lu = require('luaunit')
local File = require('lib.file')
local Day01 = require('day01.day01')

TestDay01 = {}

function TestDay01:setUp()
    self.input_test = File:lines_from('day01/input-test.txt')
    self.input = File:lines_from('day01/input.txt')
end

function TestDay01:test_count_depth_increases()
    lu.assertEquals(Day01.count_depth_increases(self.input_test, 1), 7)
    lu.assertEquals(Day01.count_depth_increases(self.input, 1), 1583)
    lu.assertEquals(Day01.count_depth_increases(self.input_test, 3), 5)
    lu.assertEquals(Day01.count_depth_increases(self.input, 3), 1627)
end
