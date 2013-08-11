jquery.simple.unsaved
=====================

A simple jQuery plugin to detect unsaved changes in a form.

Based on an idea from *Mister Dai* : [original article](http://misterdai.yougeezer.co.uk/2010/06/04/jquery-form-changed-warning/)


Usage
---------------------

To start 'watching' forms, use

				$('form').checkChanges();

Then, if the user tries to leave the current page with unsaved changes, she will be prompted.


To stop 'watching' use

				$('form').checkChanges('destroy');

Requirements
---------------------

*jQuery* <=1.6

for *jQuery* >= 1.7, change usages of `bind` to `on` ( [see docs](http://api.jquery.com/on/) )