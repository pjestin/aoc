local lu = require('luaunit')
local File = require('lib.file')
local Day17 = require('day17.day17')

TestDay17 = {}

function TestDay17:test_find_highest_position()
    lu.assertEquals(Day17.find_highest_position("target area: x=20..30, y=-10..-5"), 45)
    lu.assertEquals(Day17.find_highest_position("target area: x=253..280, y=-73..-46"), 2628)
end

function TestDay17:test_count_velocity_values()
    lu.assertEquals(Day17.count_velocity_values("target area: x=20..30, y=-10..-5"), 112)
    lu.assertEquals(Day17.count_velocity_values("target area: x=253..280, y=-73..-46"), 1334)
end
