var quiz = {
	views: {},
	models: {}
};

(function (app) {

	app.models.Book = Backbone.Model.extend({});

	app.models.Books = Backbone.Collection.extend({
		model: app.models.Book,
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
	var books = new quiz.models.Books([
		new quiz.models.Book({title: 'Pride & Prejudice', authorImg: 'austen.jpg'}),
		new quiz.models.Book({title: 'Heart of Darkness', authorImg: 'conrad.jpg'}),
		new quiz.models.Book({title: 'Lord Jim', authorImg: 'conrad.jpg'}),
		new quiz.models.Book({title: 'Tender is the Night', authorImg: 'fitzgerald.jpg'}),
		new quiz.models.Book({title: 'The Sun Also Rises', authorImg: 'hemingway.jpg'}),
		new quiz.models.Book({title: 'The Old Man and The Sea', authorImg: 'hemingway.jpg'}),
		new quiz.models.Book({title: 'The Stand', authorImg: 'king.jpg'}),
		new quiz.models.Book({title: 'Misery', authorImg: 'king.jpg'}),
		new quiz.models.Book({title: 'Moby Dick', authorImg: 'melville.jpg'}),
		new quiz.models.Book({title: '1984', authorImg: 'orwell.jpg'}),
		new quiz.models.Book({title: 'Animal Farm', authorImg: 'orwell.jpg'}),
		new quiz.models.Book({title: 'The Cask of Amontillado', authorImg: 'poe.jpg'}),
		new quiz.models.Book({title: 'The Raven', authorImg: 'poe.jpg'}),
		new quiz.models.Book({title: 'Midnight\'s Children', authorImg: 'rushdie.jpg'}),
		new quiz.models.Book({title: 'Satanic Verses', authorImg: 'rushdie.jpg'}),
		new quiz.models.Book({title: 'Frankenstein', authorImg: 'shelley.jpg'}),
		new quiz.models.Book({title: 'Dracula', authorImg: 'stoker.jpg'}),
		new quiz.models.Book({title: 'Walden', authorImg: 'thoreau.jpg'}),
		new quiz.models.Book({title: 'Civil Disobedience', authorImg: 'thoreau.jpg'}),
		new quiz.models.Book({title: 'Lord of the Rings', authorImg: 'tolkein.jpg'}),
		new quiz.models.Book({title: 'The Hobbit', authorImg: 'tolkein.jpg'}),
		new quiz.models.Book({title: 'War and Peace', authorImg: 'tolstoy.jpg'}),
		new quiz.models.Book({title: 'Adventures of Huckleberry Finn', authorImg: 'twain.jpg'}),
		new quiz.models.Book({title: 'The Awful German Language', authorImg: 'twain.jpg'})
	]);

	var page = new quiz.views.Page({collection: books.shuffle().slice(0,3)});
	$('body').append(page.render().el);
});