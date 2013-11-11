+function ($) {

var RE_ID = /-(\d+)/;
var CHANGE_ATTRS = ['id', 'name'];


function FormSetMagic(forms, options) {
	this.forms = forms;

	// parse options
	this.options = $.extend({
		'add_button': null,  // an existent add button element
		'add_label': 'Add',  // 'add' label
		'remove_label': 'Remove',  // 'remove' label
		'form_added': function () {}  // 'form added' callback
	}, options);

	// try to retrieve the prefix used in the forms
	try {
		this.form_prefix = (
			$(forms[0]).attr('data-prefix') ||
			$(':input', forms[0]).attr('name').split('-')[0]);
	} catch (error) {
		throw new Error('unable to find the formset prefix.');
	}

	// the first form is used as a base
	this.base_form = $(this.forms[0]).clone();

	// empty all fill-able fields
	$(':input:not([type="hidden"])', this.base_form).val(null);

	// the 'add' button
	this.add_button = this.options['add_button'] ||
		$('<button type="button" class="add_form"></button>');
	if (!this.options['add_button'])
		this.add_button.text(this.options['add_label']);
}

FormSetMagic.prototype.update = function () {
	// update TOTAL_FORMS
	$('[name="'+this.form_prefix+'-TOTAL_FORMS"]').val(this.forms.length);
};

FormSetMagic.prototype.add_form = function () {
	var new_form = this.base_form.clone();
	var form_n = ++$(':input', this.forms.last()).attr('name').match(RE_ID)[1];

	// the 'remove' button
	var rm_button = $('<button type="button" class="rm_form"></button>');
	rm_button.text(this.options['remove_label']);
	new_form.append(rm_button);
	var this_ = this; rm_button.on('click', function () {
		this_.forms = this_.forms.not(new_form);
		this_.update();
		new_form.remove();
	});

	// overwrite IDs and NAMEs to set 'form_n'
	$('*', new_form).each(function () {
		var element = $(this);
		for (var attr_name, i = -1; attr_name = CHANGE_ATTRS[++i];)
			element.attr(attr_name) && element.attr(
				attr_name,
				element.attr(attr_name).replace(RE_ID, '-'+form_n)
			);
	});

	// render
	this.forms.last().after(new_form);

	// add the raw form element
	this.forms.push(new_form[0]);
	this.update();

	// call the 'form added' callback
	this.options.form_added();
};

FormSetMagic.prototype.render = function () {
	var this_ = this;
	this.add_button.on('click', function () { this_.add_form() });

	if (!this.options.add_button)
		this.forms.last().after(this.add_button);
};


// expose it as a jQuery plugin
$.fn.formset_magic = function (options) {
	(new FormSetMagic(this, options)).render();
};

}(jQuery)
