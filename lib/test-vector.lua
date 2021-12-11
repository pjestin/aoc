local lu = require("luaunit")
local Vector = require("lib.vector")

TestVector = {}

function TestVector:test_to_string()
    lu.assertEquals(Vector:new{
        x = 1,
        y = 2
    }:to_string(), "{x = 1, y = 2}")
end

function TestVector:test_line_points_vertical()
    local origin = Vector:new{
        x = 5,
        y = 2
    }
    local termination = Vector:new{
        x = 5,
        y = 0
    }
    local line_points = origin:line_points(termination)
    lu.assertEquals(#line_points, 3)
    lu.assertEquals(line_points[1], {
        x = 5,
        y = 2
    })
    lu.assertEquals(line_points[2], {
        x = 5,
        y = 1
    })
    lu.assertEquals(line_points[3], {
        x = 5,
        y = 0
    })
end

function TestVector:test_line_points_diagonal()
    local origin = Vector:new{
        x = 0,
        y = 3
    }
    local termination = Vector:new{
        x = 4,
        y = -1
    }
    local line_points = origin:line_points(termination)
    lu.assertEquals(#line_points, 5)
    lu.assertEquals(line_points[1], {
        x = 0,
        y = 3
    })
    lu.assertEquals(line_points[2], {
        x = 1,
        y = 2
    })
    lu.assertEquals(line_points[3], {
        x = 2,
        y = 1
    })
    lu.assertEquals(line_points[4], {
        x = 3,
        y = 0
    })
    lu.assertEquals(line_points[5], {
        x = 4,
        y = -1
    })
end
