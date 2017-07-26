import React from 'react';
import _ from 'underscore';

class ActivePlayerPrompt extends React.Component {
    constructor() {
        super();

        this.timer = {};

        this.state = {
        };
    }

    componentWillReceiveProps(props) {
        if(_.any(props.buttons, button => {
            return button.timer;
        })) {
            if(this.timer.handle) {
                return;
            }

            this.timer.started = new Date();
            this.timer.timerTime = _.isUndefined(this.props.user.settings.windowTimer) ? 10 : this.props.user.settings.windowTimer;

            this.setState({ showTimer: true, timerClass: '100%' });

            this.timer.handle = setInterval(() => {
                let now = new Date();
                let difference = (now - this.timer.started) / 1000;
                let keepGoing = true;

                if(difference > this.timer.timerTime) {
                    clearInterval(this.timer.handle);
                    this.timer.handle = undefined;

                    keepGoing = false;

                    if(this.props.onTimerExpired) {
                        this.props.onTimerExpired();
                    }
                }

                let timerClass = (((this.timer.timerTime - difference) / this.timer.timerTime) * 100) + '%';
                this.setState({ showTimer: keepGoing, timerClass: timerClass, timeLeft: (this.timer.timerTime - difference).toFixed() });
            }, 100);
        }
    }

    onButtonClick(event, command, arg, method) {
        event.preventDefault();

        if(this.props.onButtonClick) {
            this.props.onButtonClick(command, arg, method);
        }
    }

    onCancelTimerClick(event, button) {
        event.preventDefault();

        if(this.timer.handle) {
            clearInterval(this.timer.handle);
        }

        this.setState({ showTimer: false });

        if(button.method) {
            this.props.onButtonClick(button.command, button.arg, button.method);
        }
    }

    onMouseOver(event, card) {
        if(card && this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut(event, card) {
        if(card && this.props.onMouseOut) {
            this.props.onMouseOut(card);
        }
    }

    getButtons() {
        let buttonIndex = 0;

        let buttons = [];

        _.each(this.props.buttons, button => {
            if(button.timer) {
                return;
            }

            let clickCallback = button.timerCancel ? event => this.onCancelTimerClick(event, button) :
                event => this.onButtonClick(event, button.command, button.arg, button.method);

            let option = (
                <button key={ button.command + buttonIndex.toString() }
                    className='btn btn-primary'
                    onClick={ clickCallback }
                    onMouseOver={ event => this.onMouseOver(event, button.card) }
                    onMouseOut={ event => this.onMouseOut(event, button.card) }
                    disabled={ button.disabled }>{ button.text }</button>);

            buttonIndex++;

            buttons.push(option);
        });

        return buttons;
    }

    render() {
        let promptTitle;

        if(this.props.promptTitle) {
            promptTitle = (<div className='menu-pane-source'>{ this.props.promptTitle }</div>);
        }

        let timer = null;

        if(this.state.showTimer) {
            timer = (
                <div>
                    <span>Auto passing in { this.state.timeLeft }...</span>
                    <div className='progress'>
                        <div className='progress-bar progress-bar-success' role='progressbar' style={ { width: this.state.timerClass } } />
                    </div>
                </div>);
        }

        return (<div>
            { timer }
            <div className={ 'phase-indicator ' + this.props.phase }>
                { this.props.phase } phase
            </div>
            { promptTitle }
            <div className='menu-pane'>
                <div className='panel'>
                    <h4>{ this.props.title }</h4>
                    { this.getButtons() }
                </div>
            </div>
        </div>);
    }
}

ActivePlayerPrompt.displayName = 'ActivePlayerPrompt';
ActivePlayerPrompt.propTypes = {
    buttons: React.PropTypes.array,
    onButtonClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onTimerExpired: React.PropTypes.func,
    phase: React.PropTypes.string,
    promptTitle: React.PropTypes.string,
    socket: React.PropTypes.object,
    title: React.PropTypes.string,
    user: React.PropTypes.object
};

export default ActivePlayerPrompt;