local lu = require('luaunit')
local File = require('lib.file')
local Day10 = require('day10.day10')

TestDay10 = {}

function TestDay10:setUp()
    self.input_test = File:lines_from('day10/input-test.txt')
    self.input = File:lines_from('day10/input.txt')
end

function TestDay10:test_find_illegal_character_score()
    lu.assertEquals(Day10.find_illegal_character_score(self.input_test), 26397)
    lu.assertEquals(Day10.find_illegal_character_score(self.input), 296535)
end

function TestDay10:test_find_completing_characters_score()
    lu.assertEquals(Day10.find_completing_characters_score(self.input_test), 288957)
    lu.assertEquals(Day10.find_completing_characters_score(self.input), 4245130838)
end

return TestDay10
