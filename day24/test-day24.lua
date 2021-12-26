local lu = require('luaunit')
local File = require('lib.file')
local Day24 = require('day24.day24')

TestDay24 = {}

function TestDay24:setUp()
    self.input = File:lines_from('day24/input.txt')
end

function TestDay24:test_find_max_monad()
    lu.assertEquals(Day24.find_output_with_monad(self.input, 93499629698999), 0)
end

function TestDay24:test_find_min_monad()
    lu.assertEquals(Day24.find_output_with_monad(self.input, 11164118121471), 0)
end

