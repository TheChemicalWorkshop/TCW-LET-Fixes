// ! get all threads and show full views
const Discussions = document.querySelectorAll(".Discussion");

for (const Discuss of Discussions) { 

  const thread_views = Discuss.querySelectorAll(".ViewCount")[0].getElementsByTagName("span")[0]

  thread_views.innerHTML = thread_views.getAttribute("title").replace(' views','')
}

