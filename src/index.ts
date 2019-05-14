import { run } from '@cycle/run';
import xstream from 'xstream';
import { div, label, input, hr, h1, makeDOMDriver } from '@cycle/dom';
import { getDrivers, wrapMain } from './drivers';
import { Component, Sources, Sinks } from './interfaces';
import { App } from './components/app';

export interface State {
    [x: string]: any;
}

type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T;
    // probably you might want to add the currentTarget as well
    // currentTarget: T;
};

let e: HTMLElementEvent<HTMLInputElement>;

function main(sources: Sources<State>): Sinks<State> {
    const inputEv$ = sources.DOM.select('.field').events('input');
    const name$ = inputEv$
        .map((ev: HTMLElementEvent<HTMLInputElement>) =>
            ev.target ? ev.target.value : null
        )
        .startWith('');

    // ---w---wo---wor--->

    return {
        DOM: xstream.of(
            div([
                label(['Name:']),
                input('.field', { attrs: { type: 'text' } }),
                hr(),
                h1('Hello ' + name + '!')
            ])
        )
    };
}
const drivers = {
    DOM: makeDOMDriver('#app')
};
// const main: Component<any> = wrapMain(App);

run(main as any, drivers);
