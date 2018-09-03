

export default ({title, body, footer, img}) => ({tag: 'div', className: 'card', children: [
    {tag: 'div', className: 'card-body', children: [
        {tag: 'h5', className: 'card-title', textContent: title},
        {tag: 'div', className: 'card-body', children: body},
        img ? {tag: 'img', attrs: {src: img}, className: 'card-img-top'} : {tag: 'span'},
        footer ? {tag: 'div', className: 'card-footer', children: footer} : {tag: 'span'}
    ]}
]})