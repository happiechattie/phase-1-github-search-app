document.addEventListener('DOMContentLoaded', e => {

    function clearAll(){
        document.querySelector('#user-list').innerHTML = '';
        document.querySelector('#repos-list').innerHTML = '';
    }
    
    function renderUserInfo(user){
        const userElement = document.createElement('li');
        const userEndPoint = document.createElement('a');
        userEndPoint.href = user.repos_url;
        userEndPoint.innerText = user.login
        userElement.append(userEndPoint);
/*
        const userAvatar = document.createElement('img');
        userAvatar.src = user.avatar_url;
        userAvatar.style.width = '90px';
*/
        const userLink = document.createElement('a');
        userLink.href = user.html_url;
        userLink.innerHTML = `</br><img src="${user.avatar_url}" style="width: 100px"/>`;

        document.querySelector('#user-list').append(userElement);
        userElement.append(userLink);

        const repoButton = document.createElement('button');
        repoButton.innerText = 'repos';
        repoButton.addEventListener('click', e => {
            document.querySelector('#repos-list').innerHTML = '';
            fetch(user.repos_url)
            .then (res => res.json())
            .then(data => {
                const list = document.querySelector('#repos-list');
                for (repo of data){
                    const repoLI = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = repo.html_url;
                    link.innerText = repo.name;
                    repoLI.append(link);
                    list.append(repoLI);
                }
            })
        })
        userElement.append(repoButton);
    }

    function showRepos(user) {
        fetch(user.repos_url)
        .then (res => res.json())
        .then(data => {
            for (r of data){
                const listElement = document.createElement('li');
                const repo = document.createElement('a');
                repo.href = r.html_url;
                repo.innerText = r.name;
                document.querySelector('#repos-list').append(listElement);
                listElement.append(repo);
            }
        })
    }

    const form = document.querySelector('#github-form');
    const toggle = document.createElement('button');
    document.querySelector('#main').append(toggle);
    
    let isUserSearch = true;
    toggle.innerText = 'user search';
    toggle.addEventListener('click', e => {
        isUserSearch = !isUserSearch;
        console.log(isUserSearch);
        if (isUserSearch) {
            toggle.innerText = 'user search';
        } else {
            toggle.innerText = 'repo search';
        }
    })
        form.addEventListener('submit', e => {
            e.preventDefault();
            if (isUserSearch === true){
            document.querySelector('#repos-list').innerHTML = '';
            document.querySelector('#user-list').innerHTML = '';
            console.log('seaching users');
            const searchFor = form.querySelector('#search').value;
//            fetch ('https://api.github.com/users/octocat/repos')
//            .then(res => res.json())
//            .then(data => {
                fetch(`https://api.github.com/search/users?q=${searchFor}`)
                .then(res => res.json())
                .then(data => {
                    for (user of data.items) {
                        renderUserInfo(user);
                    }
                })
                return;
//            })
    } else if  (isUserSearch === false) {
        document.querySelector('#repos-list').innerHTML = '';
        document.querySelector('#user-list').innerHTML = '';
            console.log('searching repos');
            const searchFor = form.querySelector('#search').value;
//            fetch ('https://api.github.com/users/octocat/repos')
//            .then(res => res.json())
//            .then(data => {
                fetch(`https://api.github.com/search/repositories?q=${searchFor}`)
                .then(res => res.json())
                .then(data => {
                    for (repo of data.items) {
                        displayRepo(repo);
                    }
                })
 //           })
        }})
    })

    function displayRepo(repo){
        const listElement = document.createElement('li');
        const repoElement = document.createElement('a');
        repoElement.href = repo.html_url;
        repoElement.innerText = repo.name;
        document.querySelector('#repos-list').append(listElement);
        listElement.append(repoElement);
    }