local lu = require('luaunit')
local File = require('lib.file')
local Day02 = require('day02.day02')

TestDay02 = {}

function TestDay02:setUp()
    self.input_test = File:lines_from('day02/input-test.txt')
    self.input = File:lines_from('day02/input.txt')
end

function TestDay02:test_count_depth_increases()
    lu.assertEquals(Day02:move_submarine(self.input_test), 150)
    lu.assertEquals(Day02:move_submarine(self.input), 2150351)
end

return TestDay02
