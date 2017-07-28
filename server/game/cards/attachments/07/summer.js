const DrawCard = require('../../../drawcard.js');

class Summer extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add attached character to the challenge',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'military',
            cost: ability.costs.kneelParent(),
            limit: ability.limit.perChallenge(1),
            handler: () => {
                if(this.game.currentChallenge.attackingPlayer === this.controller) {
                    this.game.currentChallenge.addAttacker(this.parent, false);
                } else {
                    this.game.currentChallenge.addDefender(this.parent, false);
                }
                this.game.addMessage('{0} uses {1} and kneels {2} to have {2} participate in the challenge on their side',
                    this.controller, this, this.parent);
            }
        }),
        //TODO: uses target API but doesn't 'target' per the game rules (doesn't use the word choose)
        this.action({
            title: 'Attach Summer to another character',
            cost: ability.costs.payGold(1),
            limit: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card !== this.parent && this.controller.canAttach(this, card)
            },
            handler: context => {
                this.controller.attach(this.controller, this, context.target);
                this.game.addMessage('{0} pays 1 gold to attach {1} to {2}',
                    this.controller, this, this.parent);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('stark') || !card.isUnique()) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Summer.code = '07034';

module.exports = Summer;
