local lu = require("luaunit")
local StringUtils = require("lib.string-utils")

TestStringUtils = {}

function TestStringUtils:test_split()
    lu.assertEquals(StringUtils:split("hello world"), {"hello", "world"})
    lu.assertEquals(StringUtils:split("hello world", " "), {"hello", "world"})
    lu.assertEquals(StringUtils:split("one;two;;four", ";"), {"one", "two", "", "four"})
    lu.assertEquals(StringUtils:split("forward 2"), {"forward", "2"})
end
