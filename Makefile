STYLUS = node_modules/.bin/stylus

all: css

css: lib lib/app.css

lib:
	mkdir -p lib

lib/app.css: styles/*.styl

lib/%.css: styles/%.styl
	$(STYLUS) -u nib -I styles < $< > $@
