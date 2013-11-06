This plugin is born from the necessity of having forms being added or
removed from a formset - front-end wise, of course.


Requirements
------------

This is a jQuery plugin, so your page must include it. Doh. It also
assumes you're using Django formsets. No voodoos are required.


Target
------

Don't use this unless you're in a rush. If you have a lot of time, code
it yourself and learn how to do such simple JavaScript tasks like these.
:-)


How to use
----------

First and foremost, forget about inserting a bunch of scripts at the
``<head>`` of your HTML. That practice is not approved by the gods of
programming and will basically f*** up the page's performance.

Now, link this script to the bottom of your markup and call its main
jQuery add-on passing a formset's form as a base to be cloned.

```html
<fieldset>
	<legend>{% trans 'Articles' %}</legend>

	{{ article_formset.management_form }}

	{% for form in article_formset %}
	<div class="article-form">
		{{ form }}
	</div>
	{% endfor %}
</fieldset>

...

<script src="{% static 'wherever/jquery-django-formsets.js' %}"></script>
<script>'use strict';+function ($) {

	$('.article-form').formset_magic();

}(jQuery)</script>
```

Yeah, just that.

You can also tweak some stuff by passing an object to the function, just
like this:

```javascript
$('.article-form').formset_magic({
	'add_label': 'Add',
	'remove_label': 'Remove',
});
```

The values passed above are the default options.
