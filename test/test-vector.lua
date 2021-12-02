local lu = require("luaunit")
local Vector = require("lib.vector")

TestVector = {}

function TestVector:test_to_string()
    lu.assertEquals(Vector:new{
        x = 1,
        y = 2
    }:to_string(), "{x = 1, y = 2}")
end
