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

function Vector:line_points(o)
    local x_list = {}
    local x_direction = (self.x <= o.x) and 1 or -1
    for x = self.x, o.x, x_direction do
        x_list[#x_list + 1] = x
    end

    local y_list = {}
    local y_direction = (self.y <= o.y) and 1 or -1
    for y = self.y, o.y, y_direction do
        y_list[#y_list + 1] = y
    end

    local points = {}
    for i = 1, math.max(#x_list, #y_list) do
        local x = (#x_list == 1) and x_list[1] or x_list[i]
        local y = (#y_list == 1) and y_list[1] or y_list[i]
        points[#points + 1] = self:new{
            x = x,
            y = y
        }
    end

    return points
end

function Vector:add(o)
    self.x = self.x + o.x
    self.y = self.y + o.y
end

return Vector
