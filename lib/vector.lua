local Vector = {}

function Vector:new(o)
    o = o or {}
    setmetatable(o, self)
    self.__index = self
    return o
end

function Vector:to_string()
    return "{x = " .. self.x .. ", y = " .. self.y .. "}"
end

return Vector
