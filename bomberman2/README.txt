Matter CollisionFilter:

  GROUP:
    Players: 0
    Ghosts: 0
    Crates,Stones and Bombs: 0
    Borders: 0

  CATEGORY:
    Players:
      1 = 0000 0000 0000 0000 0000 0000 0000 0001
      2 = 0000 0000 0000 0000 0000 0000 0000 0010
      4 = 0000 0000 0000 0000 0000 0000 0000 0100
      8 = 0000 0000 0000 0000 0000 0000 0000 1000
    Ghosts:
       16 = 0000 0000 0000 0000 0000 0000 0001 0000
       32 = 0000 0000 0000 0000 0000 0000 0010 0000
       64 = 0000 0000 0000 0000 0000 0000 0100 0000
      128 = 0000 0000 0000 0000 0000 0000 1000 0000
    Crates,Stones and Bombs:
      256 = 0000 0000 0000 0000 0000 0001 0000 0000
    Borders:
      512 = 0000 0000 0000 0000 0000 0010 0000 0000

  MASK:
    	Players:
        256+512  							        <-- Jogadores colidem com Caixas,Pedras,Bombas e Bordas
    	Ghosts:
        512 	    							      <-- Fantasmas só colidem com as Bordas
      Crates,Stones and Bombs:
        1+2+4+8+256+512 					    <-- Caixas, Pedras, Bombas colidem entre si, com Jogadores e com as Bordas
      Borders:
        1+2+4+8+16+32+64+128+256+512 	<-- Bordas colidem com tudo.
