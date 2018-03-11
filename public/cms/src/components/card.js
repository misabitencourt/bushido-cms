

export default ({title, body}) => ({tag: 'div', className: 'card', children: [
    {tag: 'div', className: 'card-body', children: [
        {tag: 'h5', className: 'card-title', textContent: title},
        {tag: 'div', className: 'card-body', children: body}
    ]}
]})