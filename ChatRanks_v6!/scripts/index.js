import { world, system } from '@minecraft/server'

//the default rank name and the scoreboard
const rank = "§7player"
let scores = "level"

function getScores(scores, player) {
    try {
        return world.scoreboard.getObjective(scores).getScore(player.scoreboardIdentity)
    } catch {
        return 0
    }
}
world.beforeEvents.chatSend.subscribe(data => {
    let rang = data.sender.getTags().find(tag => tag.startsWith("rank-"))?.substring(5)?.replaceAll("-", "") ?? `${rank}`;
    let rang2 = data.sender.getTags().find(tag => tag.startsWith("rank2-"))?.substring(5)?.replaceAll("-", "") ?? ``;
    let score = getScores(scores, data.sender);
    if (rang) {
        world.sendMessage(`[${score}] [${rang}§r] §r${data.sender.name} ${rang2}§8:§r ${data.message}`)
    }
    if (!data.message.startsWith("!")) return data.cancel = true;
});
system.runInterval(data => {
    for (const player of world.getPlayers()) {
        let score = getScores(scores, player);
        if (player.getTags().find(tag => tag.startsWith("rank-"))?.substring(5)?.replaceAll("-", "") ?? `${rank}`) {
            player.nameTag = `§r${score} ${player.getTags().find(tag=>tag.startsWith("rank-"))?.substring(5)?.replaceAll("-","")??`${rank}`} §r${player.name}`
        } else {
            player.nameTag = `§r${score} ${rank} §r${player.name}`
        }
    }
});
