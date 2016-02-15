/*
	La classe Unite
	Cette classe correspond aux unités dans le réseau : machines ou matérieux de connexion.
*/
var Unite = function Unite(nom, type, niveau, numPosition){
	//verifier les parametres d'entree à faire...
	this.nom = nom; // string
	this.type = type; // "client" | "serveur" | "switch" | "hub"
	this.position = niveau.getPosition(numPosition);
	// il faut déplacer les avatars dans un autre fichier et faire une methode avec switch plus tard
	if (this.type == "client")
		this.avatar = '<rect id="' + this.nom + '" x="' +this.position.getX()
					+ '" y="' + this.position.getY() + '" width="' 
					+ 2*ATOMX + '" height="' + 2*ATOMY + '" fill="white" stroke="gray" stroke-width="2"></rect>';
					
	if (this.type == "serveur")
		this.avatar = '<rect id="' + this.nom + '" x="' +this.position.getX()+ '" y="' 
					+ this.position.getY() + '" width="' 
					+ 2*ATOMX + '" height="' + 4*ATOMY + '" fill="white" stroke="gray" stroke-width="2"></rect>';
					
	if (this.type == "switch")
		this.avatar = '<rect id="' + this.nom + '" x="' +this.position.getX()
					+ '" y="' + this.position.getY() + '" width="' 
					+ 3*ATOMX + '" height="' + ATOMY + '" fill="white" stroke="blue" stroke-width="2"></rect>';
					
	if (this.type == "hub")
		this.avatar = '<rect id="' + this.nom + '" x="' +this.position.getX()+ '" y="' 
					+ this.position.getY() + '" width="' 
					+ 3*ATOMX + '" height="' + ATOMY + '" fill="white" stroke="green" stroke-width="2"></rect>';
}
/*
	Methodes
*/
//getters
Unite.prototype.getNom = function(){
	return this.nom;
}
Unite.prototype.getType = function(){
	return this.type;
}
//setters
Unite.prototype.setType = function(type){
	this.type = type;
}
//autres
Unite.prototype.afficher = function(elemParent){
	document.getElementById(elemParent).innerHTML += this.avatar;
}