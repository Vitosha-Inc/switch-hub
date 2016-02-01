window.onload = function(){
	var c = new Carte(4, 5);
		
	var m0 = new Machine("machine_0", "client", c.niveau(0), 0);
	console.log(m0);
	console.log(m0.getNom(), m0.getType());
	m0.afficher("schema-reseau");
	
	var m1 = new MachineConnectee("machine_1", "client", c.niveau(0), 1, "MAC");
	console.log(m1);
	console.log(m1.getNom(), m1.getType(), m1.getRole());
	m1.afficher("schema-reseau");
	
	var ms = new Machine("machine_2", "serveur",c.niveau(2), 3, "MAC");
	console.log(ms);
	ms.afficher("schema-reseau");
	
	var mtr0 = new Materiel("switch_0", "switch", 4, c.niveau(1), 0);
	var mtr1 = new Materiel("switch_1", "hub", 4, c.niveau(1), 1);
	console.log(mtr0, mtr1);
	mtr0.afficher("schema-reseau");
	mtr1.afficher("schema-reseau");
	
	//console.log(document.getElementById("machine_0"));
	var machine_0 = document.getElementById("machine_0");
	machine_0.addEventListener("mouseover", function(evt){ evt.target.setAttribute("fill", "red");});
	machine_0.addEventListener("mouseout", function(evt){ evt.target.setAttribute("fill", "none");});
	machine_0.addEventListener("click", function(evt){ window.alert("ok");});
	/*
	var p1 = new Port(2);
	var p2 = new Port(3);
	var p3 = new Port(4);
	var p4 = new Port(5);
	
	var mtr = new Materiel("switch_1", 4);
	console.log(mtr);
	console.log(mtr.getNom(), mtr.getNbrPorts());
	mtr.ajouterPorts(p, p1);
	console.log(mtr.getPorts());
	mtr.ajouterPorts(p2, p3, p4);
	console.log(mtr.getPorts());*/
	
};