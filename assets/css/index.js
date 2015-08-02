'use strict';

const COLUMN_PADDING = '6px';

new Rule('.row', {
  'display'           :   'flex',
  'justify-content'   :   'space-around',
  'flex-flow'         :   'row wrap'
})

let column = new Rule('.column', {
  'margin'            :   'auto',
  'word-wrap'         :  ' break-word',
  'padding'           :   COLUMN_PADDING,
  'box-sizing'        :   'padding-box',
  'background': '#eee'
});

for ( let i = 0; i < 100; i += 5) {
  if ( i ) {
    new Rule(`.column-${i}`, {
      'width'           :   `calc(${i}% - ${COLUMN_PADDING})`,
      column
    }, {
      extend            :   column
    });
  }
}

new Rule('.memory-bar', {
  background: '#ccc', color : 'white', 'text-align': 'center', height: '1.5em', padding: COLUMN_PADDING
});

new Rule('.memory-used', {
  padding: '.75em '
});

new Rule('.memory-percent', { 'margin-top' : '-1.30em' });
