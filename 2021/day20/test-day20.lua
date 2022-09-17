local lu = require('luaunit')
local File = require('lib.file')
local Day20 = require('day20.day20')

TestDay20 = {}

function TestDay20:setUp()
    self.input_test = File:lines_from('day20/input-test.txt')
    self.input = File:lines_from('day20/input.txt')
end

function TestDay20:test_count_pixels_2_iterations()
    lu.assertEquals(Day20.count_pixels(self.input_test, 2), 35)
    lu.assertEquals(Day20.count_pixels(self.input, 2), 5682)
end

function TestDay20:test_count_pixels_50_iterations()
    lu.assertEquals(Day20.count_pixels(self.input_test, 50), 3351)
    lu.assertEquals(Day20.count_pixels(self.input, 50), 17628)
end
