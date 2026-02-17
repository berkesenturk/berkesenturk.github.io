---
layout: default
title: Blog
permalink: /blog/
---

# Blog

<div class="blog-grid">

{% for post in site.posts %}
  <div class="blog-card">

    {% if post.image %}
    <img src="{{ post.image }}" class="blog-card-img" alt="{{ post.title }}">
    {% endif %}

    <div class="blog-card-content">
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.description }}</p>
      <small>{{ post.date | date: "%B %d, %Y" }}</small>
    </div>

  </div>
{% endfor %}

</div>
