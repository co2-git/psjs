'use strict';

const
  COLUMN_PADDING      =   '6px',
  FONT_SIZE           =   '1em',
  FONT_FAMILY         =   'Helvetica, Arial, sans-serif',
  HEADER_FONT_FAMILY  =   "'Oswald', sans-serif",
  HEADER_FONT_WEIGHT  =   900,
  HEADER_LINE_HEIGHT  =   '1.3em',
  MUTE                =   '#ccc',

  FONT_FACE         =   `
/* latin-ext */
@font-face {
  font-family: 'Oswald';
  font-style: normal;
  font-weight: 400;
  src: local('Oswald Regular'), local('Oswald-Regular'), url(../fonts/oswald/latin-ext.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}

/* latin */
@font-face {
  font-family: 'Oswald';
  font-style: normal;
  font-weight: 400;
  src: local('Oswald Regular'), local('Oswald-Regular'), url(../fonts/oswald/latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}
`,

  ROW               =   () => `
  display: flex;
  justify-content: space-around;
  flex-flow: row wrap
  `,

  COLUMN            =   () => `
  margin: auto;
  word-wrap: break-word;
  padding: ${COLUMN_PADDING};
  box-sizing: border-box;
  background: #eee
  `,

  COLUMNS           =   i => `
.column-${i} {
  width: calc(${i}% - ${COLUMN_PADDING});
  ${COLUMN()}
}
  `,

  TOP_BAR           =   () => `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-bottom: 1px solid #ccc;
  opacity: .75;
  padding: 4px;
  `,

  TOPBAR_H1_SMALL   =   () => `
  font-size: 90%;
  font-style: italic;
  color: ${MUTE};
  padding: 4px;
  `,

  PROGRESS_BAR        =   () => `
  background: #ccc;
  color: white;
  text-align: center;
  height: 1.5em;
  display: inline-block;
  `,

  PROGRESS_BAR_PERCENT  =   () => `
   padding: .75em;`,

  PROGRESS_BAR_LABEL    =   () => `
  margin-top: -1.30em;
  cursor: pointer`
;


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// OUTPUT
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

console.log(`

/** Typo **/

${FONT_FACE}

html {
  font-size:        ${FONT_SIZE};
  font-family:      ${FONT_FAMILY};
}

body {
  padding-top: 40px;
}

h1, h2, h3, h4, h5 {
  font-family:      ${HEADER_FONT_FAMILY};
  font-weight:      ${HEADER_FONT_WEIGHT};
  line-height:      ${HEADER_LINE_HEIGHT};
}

/** Grid */

.row { ${ROW()}
}

.column { ${COLUMN()}
}

`);

for ( let i = 0; i <= 100; i += 5 ) {
  if ( i ) {
    console.log(COLUMNS(i));
  }
}

console.log(`
/** Top bar **/

.top-bar { ${TOP_BAR()}
}

.top-bar h1 small { ${TOPBAR_H1_SMALL()}
}

.top-bar .progress_bar {
  width: 80px;
}

.top-bar .progress_bar,
.top-bar .progress_bar .progress_bar-percent {
  border-radius: 0 4px 4px 0;
}

.top-bar .progress_bar:first-child,
.top-bar .progress_bar:first-child .progress_bar-percent {
  border-radius: 4px 0 0 4px;
}
`);

console.log(`
.progress_bar { ${PROGRESS_BAR()}
}

.progress_bar-percent { ${PROGRESS_BAR_PERCENT()}
}

.progress_bar-label { ${PROGRESS_BAR_LABEL()}
}
`);
