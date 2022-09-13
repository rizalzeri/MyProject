class mahasiswa {
  String nama;

  void setname( String nm){
    nama = nm;
  }
  String getnama(){
    return nama;
  }

}

public class coba{
  public static void main(String[] args){
    mahasiswa m1 = new mahasiswa();
    m1.setname("Roy");
    System.out.println(m1.getnama());

  }

}