import card from './card'
import form from './form'

export default el => createEls('div', 'app-wrp container', el, [
    {tag: 'div', className: 'login-wrp', children: [
        {tag: 'div', className: 'row', children: [
            {tag: 'div', className: 'col-md-4'},
            {tag: 'div', className: 'col-md-4 text-md-center', children: [
                card({
                    title: 'Login',
                    body: [
                        form({
                            fieldCol: 12,
                            fields: [
                                {type: 'email', name: 'email', placeholder: 'E-mail', required: true},
                                {type: 'password', name: 'passwd', placeholder: 'Senha', required: true},
                                {type: 'submit', name: 'submit', label: 'Entrar'}
                            ],
                            onSubmit() {
                                
                            }
                        })
                    ]
                })
            ]},            
            {tag: 'div', className: 'col-md-4'}
        ]}
    ], bootstrap(el) {
        if (window.innerHeight > 500) {
            el.style.paddingTop = '13%';
        }
    }}
]);


// <div class="card" style="width: 18rem;">
//   <div class="card-body">
//     <h5 class="card-title">Card title</h5>
//     <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
//     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//     <a href="#" class="card-link">Card link</a>
//     <a href="#" class="card-link">Another link</a>
//   </div>
// </div>