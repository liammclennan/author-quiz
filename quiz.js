var quiz = {
	views: {},
	models: {}
};

(function (app) {

	app.models.Book = Backbone.Model.extend({});

	app.models.Books = Backbone.Collection.extend({
		model: app.models.Book,
		url: 'http://withouttheloop.com:3002/books'
	});
	
	app.views.Page = Backbone.View.extend({
		className: 'page',
		events: {
			'click .answer': 'onAnswer',
			'click input[type=button]': 'onNext'
		},
		initialize: function () {
			if (this.collection.length !== 3) throw new Error('Page can only display three answers');
		},
		render: function () {
			this.answer = this.collection[getRandomInt(0,2)];
			var mugshot = new app.views.Mugshot({ model: this.answer });
			var answers = new app.views.Answers({ collection: this.collection });
			this.$el.append(mugshot.render().el, answers.render().el);
			return this;
		},
		onAnswer: function (e) {
			var answered = _(this.collection).find(function (book) {
				return book.get('title') === $(e.target).attr('data-title');
			});
			$('body').css('background-color', answered.get('title') === this.answer.get('title') ? 'green' : 'red');
		},
		onNext: function () {
			window.location.reload();
		}
	});

	app.views.Mugshot = Backbone.View.extend({
		className: 'mugshot',
		render: function () {
			this.$el.html(Handlebars.templates.mugshot(this.model.toJSON()));
			return this;
		}
	});

	app.views.Answers = Backbone.View.extend({
		className: 'answers',
		render: function () {
			var map = ['A','B','C'];
			this.collection.forEach(function (book, index) {
				var model = _.extend(book.toJSON(), { label: map[index] });
				this.$el.append(Handlebars.templates.answer(model))
			}, this);
			return this;
		}
	});

	function getRandomInt(min, max)  
	{  
	  return Math.floor(Math.random() * (max - min + 1)) + min;  
	}

})(quiz);

$(function () {
	var books = new quiz.models.Books();
	books.fetch({
		success: function() {
			var page = new quiz.views.Page({collection: books.shuffle().slice(0,3)});
			$('body').append(page.render().el);
		}
	});
});