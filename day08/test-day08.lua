local lu = require('luaunit')
local File = require('lib.file')
local Day08 = require('day08.day08')

TestDay08 = {}

function TestDay08:setUp()
    self.input_test = File:lines_from('day08/input-test.txt')
    self.input = File:lines_from('day08/input.txt')
end

function TestDay08:test_count_easy_digits()
    lu.assertEquals(Day08.count_easy_digits(self.input_test), 26)
    lu.assertEquals(Day08.count_easy_digits(self.input), 272)
end

function TestDay08:test_decode_digits()
    lu.assertEquals(Day08.decode_digits(self.input_test), 61229)
    lu.assertEquals(Day08.decode_digits(self.input), 1007675)
end

return TestDay08
