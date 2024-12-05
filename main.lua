RegisterServerEvent('updatePlaytime')
AddEventHandler('updatePlaytime', function(name, license)
    MySQL.Async.fetchScalar('SELECT playtime FROM playtime WHERE license = @license', {
        ['@license'] = license
    }, function(result)
        if result then
            MySQL.Async.execute('UPDATE playtime SET playtime = playtime + 1 WHERE license = @license', {
                ['@license'] = license
            })
        else
            MySQL.Async.execute('INSERT INTO playtime (license, playtime) VALUES (@license, 1)', {
                ['@license'] = license
            })
        end
        TriggerEvent('syncPlaytimeToJS', name, license, result and (result + 1) or 1)
    end)
end)

RegisterNetEvent('syncPlaytimeToClient')
AddEventHandler('syncPlaytimeToClient', function(name, license, playtime)
    TriggerClientEvent('receivePlaytime', -1, name, license, playtime)
end)

CreateThread(function()
    while true do
        Wait(60000)
        for _, playerId in ipairs(GetPlayers()) do
            local license
            local name = GetPlayerName(playerId)
            for _, id in ipairs(GetPlayerIdentifiers(playerId)) do
                if id:sub(1, 8) == "license:" then
                    license = id:sub(9)
                    break
                end
            end
            if license then
                TriggerEvent('updatePlaytime', name, license)
            end
        end
    end
end)
CreateThread(function()
    while true do
        Wait(500)
        MySQL.Async.fetchAll('SELECT * FROM playtime', {}, function(results)
            for _, row in ipairs(results) do
                local name = row.name or "Player"
                local license = row.license
                local playtime = row.playtime
                TriggerEvent('syncPlaytimeToJS', name, license, playtime)
            end
        end)
    end
end)
RegisterNetEvent('resetPlaytimeForLicense')
AddEventHandler('resetPlaytimeForLicense', function(license)
    MySQL.Async.execute('DELETE FROM playtime WHERE license = @license', {
        ['@license'] = license
    })
end)

RegisterNetEvent('resetAllPlaytimes')
AddEventHandler('resetAllPlaytimes', function()
    MySQL.Async.execute('DELETE FROM playtime', {})
end)
