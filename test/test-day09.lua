local lu = require('luaunit')
local File = require('lib.file')
local Day09 = require('day09.day09')

TestDay09 = {}

function TestDay09:setUp()
    self.input_test = File:lines_from('day09/input-test.txt')
    self.input = File:lines_from('day09/input.txt')
end

function TestDay09:test_count_low_point_risk()
    lu.assertEquals(Day09.count_low_point_risk(self.input_test), 15)
    lu.assertEquals(Day09.count_low_point_risk(self.input), 560)
end

function TestDay09:test_find_largest_basins()
    lu.assertEquals(Day09.find_largest_basins(self.input_test), 1134)
    lu.assertEquals(Day09.find_largest_basins(self.input), 959136)
end

return TestDay09
