function PK54ToWGS(l0, x, y) {
	var bf,vf,nf,ynf,tf,yf2,hbf;
	var sa,sb,se2,sep2,mf;
	var w1,w2,w,w3,w4;
	var pi = 3.1415926;

	x = x/1000000.0;
	y = y - 500000.0;

	bf = 9.04353692458*x-0.00001007623*Math.pow(x,2.0)-0.00074438304*Math.pow(x,3.0)-0.00000463064*Math.pow(x,4.0)+0.00000505846*Math.pow(x,5.0)-0.00000016754*Math.pow(x,6.0);
	hbf = bf * pi/ 180.0;
	sa = 6378245.0;
	sb = 6356863.019;
	se2 = 0.006693421623;
	sep2 = 0.006738525415;

	w1 = Math.sin(hbf);
	w2 = 1.0 - se2 * Math.pow(w1, 2);
	w = Math.sqrt(w2);
	mf = sa*(1.0-se2)/Math.pow(w, 3);
	w3 = Math.cos(hbf);

	w4 = Math.pow(sa, 2)*Math.pow(w3, 2) + Math.pow(sb, 2)*Math.pow(w1, 2);
	nf = Math.pow(sa, 2) / Math.sqrt(w4);

	ynf = y/nf;
	vf = nf/mf;
	tf = Math.tan(hbf);

	yf2 = sep2 * Math.pow(w3,  2);
	var res = new Object();
	res.y = bf - 1.0/2.0 * vf * tf * (Math.pow(ynf, 2)-1.0/12.0*(5.0+3.0*Math.pow(tf, 2)+yf2-9.0*yf2*Math.pow(tf, 2))*Math.pow(ynf, 4))*180.0/pi;
	res.x =1.0/w3*ynf*(1.0-1.0/6.0*(1.0+2.0*Math.pow(tf, 2)+yf2)*Math.pow(ynf, 2)+1.0/120.0*(5.0+28.0*Math.pow(tf, 2)+24.0*Math.pow(tf, 2)+6.0*yf2+8.0*yf2*Math.pow(tf, 2))*Math.pow(ynf, 4))*180.0/pi + l0;
	res.y *= 10000000;
	res.x *= 10000000;
	return res;
}

