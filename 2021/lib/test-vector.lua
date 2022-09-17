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

function TestVector:test_add()
    local a = Vector:new{
        x = 5,
        y = -8
    }
    local b = Vector:new{
        x = -15,
        y = 20
    }
    a:add(b)
    lu.assertEquals(a.x, -10)
    lu.assertEquals(a.y, 12)
    lu.assertEquals(b.x, -15)
    lu.assertEquals(b.y, 20)
end

function TestVector:test_add3d()
    local a = Vector:new{
        x = 5,
        y = -8,
        z = 10
    }
    local b = Vector:new{
        x = -15,
        y = 20,
        z = -19
    }
    a:add(b)
    lu.assertEquals(a.x, -10)
    lu.assertEquals(a.y, 12)
    lu.assertEquals(a.z, -9)
    lu.assertEquals(b.x, -15)
    lu.assertEquals(b.y, 20)
    lu.assertEquals(b.z, -19)
end

function TestVector:test_distance()
    local a = Vector:new{
        x = 5,
        y = -8,
        z = 35
    }
    local b = Vector:new{
        x = -15,
        y = 20,
        z = 105
    }
    lu.assertEquals(a:distance(b), 118)
end
