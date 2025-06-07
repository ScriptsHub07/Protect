export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border/50 py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Chef das Receitas. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
