deploy:
	fly deploy --no-cache

proxy:
	fly proxy  27017 -a avhris-db
