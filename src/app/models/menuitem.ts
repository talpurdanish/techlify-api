export class MenuItem {
  title?: string;
  class?: string = 'fa fa-home';
  name?: string = '';
  link?: string;
  role?: string;
  haschild: boolean = false;
  public SubMenus: MenuItem[] = [];

  constructor(
    titleC: string,
    roleC: string,
    linkC: string,
    nameC: string,
    classC: string,
    haschildC: boolean = true
  ) {
    this.title = titleC;
    this.class = classC;
    this.name = nameC;
    this.link = linkC;
    this.role = roleC;
    this.haschild = haschildC;
  }
}
