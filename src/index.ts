import { run } from '@cycle/run';
import { default as xs } from 'xstream';
import {
    div,
    label,
    input,
    hr,
    h1,
    makeDOMDriver,
    button,
    p
} from '@cycle/dom';
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
    const decClick$ = sources.DOM.select('.dec').events('click');
    const incClick$ = sources.DOM.select('.inc').events('click');

    const dec$ = decClick$.map(() => -1); // --(-1)----------(-1)-->
    const inc$ = incClick$.map(() => +1); // --------(+1)---------->

    const delta$ = xs.merge(dec$, inc$); // --(-1)---(+1)----(-1)-->

    const number$ = delta$.fold((prev, x) => prev + x, 0);

    return {
        DOM: number$.map(number =>
            div([
                button('.dec', 'Decrement'),
                button('.inc', 'Increment'),
                p([label('Count: ' + number)])
            ])
        )
    };
}
const drivers = {
    DOM: makeDOMDriver('#app')
};
// const main: Component<any> = wrapMain(App);

run(main as any, drivers);
