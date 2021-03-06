const DrawCard = require('../../../drawcard.js');

class PlazaOfPunishment extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: ({challenge}) => challenge.winner === this.controller && challenge.challengeType === 'power'
            },
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.attachments.size() === 0
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyStrength(-2),
                        ability.effects.killByStrength
                    ]
                }));

                this.game.addMessage('{0} kneels {1} to give {2} -2 STR until the end of the phase and kill it if its STR is 0',
                    this.controller, this, context.target);
            }
        });
    }
}

PlazaOfPunishment.code = '01173';

module.exports = PlazaOfPunishment;
