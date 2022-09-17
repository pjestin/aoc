local lu = require('luaunit')
local File = require('lib.file')
local Day16 = require('day16.day16')

TestDay16 = {}

function TestDay16:setUp()
    self.input_test = File:lines_from('day16/input-test.txt')[1]
    self.input_test_2 = File:lines_from('day16/input-test-2.txt')[1]
    self.input_test_3 = File:lines_from('day16/input-test-3.txt')[1]
    self.input_test_4 = File:lines_from('day16/input-test-4.txt')[1]
    self.input_test_5 = File:lines_from('day16/input-test-5.txt')[1]
    self.input_test_6 = File:lines_from('day16/input-test-6.txt')[1]
    self.input_test_7 = File:lines_from('day16/input-test-7.txt')[1]
    self.input_test_8 = File:lines_from('day16/input-test-8.txt')[1]
    self.input = File:lines_from('day16/input.txt')[1]
end

function TestDay16:test_sum_version_numbers()
    lu.assertEquals(Day16.sum_version_numbers(self.input_test), 6)
    lu.assertEquals(Day16.sum_version_numbers(self.input_test_2), 9)
    lu.assertEquals(Day16.sum_version_numbers(self.input_test_3), 14)
    lu.assertEquals(Day16.sum_version_numbers(self.input_test_4), 16)
    lu.assertEquals(Day16.sum_version_numbers(self.input_test_5), 12)
    lu.assertEquals(Day16.sum_version_numbers(self.input_test_6), 31)
    lu.assertEquals(Day16.sum_version_numbers(self.input), 960)
end

function TestDay16:test_decode_outermost_value()
    lu.assertEquals(Day16.decode_outermost_value(self.input_test), 2021)
    lu.assertEquals(Day16.decode_outermost_value(self.input_test_2), 1)
    lu.assertEquals(Day16.decode_outermost_value(self.input_test_3), 3)
    lu.assertEquals(Day16.decode_outermost_value(self.input_test_7), 54)
    lu.assertEquals(Day16.decode_outermost_value(self.input_test_8), 1)
    lu.assertEquals(Day16.decode_outermost_value(self.input), 12301926782560)
end
